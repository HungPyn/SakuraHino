package com.sakurahino.learningservice.service.impl;

import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.security.AuthHelper;
import com.sakurahino.learningservice.dto.lesson.LessonWithStatusDTO;
import com.sakurahino.learningservice.dto.topic.TopicWithStatusDTO;
import com.sakurahino.learningservice.entity.Lesson;
import com.sakurahino.learningservice.entity.Topic;
import com.sakurahino.learningservice.entity.UserLessonStatus;
import com.sakurahino.learningservice.entity.UserTopicStatus;
import com.sakurahino.learningservice.enums.LearningStatus;
import com.sakurahino.learningservice.enums.ProgressStatus;
import com.sakurahino.learningservice.enums.ResultStatus;
import com.sakurahino.learningservice.repository.*;
import com.sakurahino.learningservice.service.UserLessonStatusService;
import com.sakurahino.learningservice.service.UserTopicStatusService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserTopicStatusServiceImpl implements UserTopicStatusService {

    private final UserTopicStatusRepository userTopicStatusRepository;
    private final TopicRepository topicRepository;
    private final LessonRepository lessonRepository;
    private final AuthHelper authHelper;
    private final UserLessonStatusService userLessonStatusService;
    private final UserStatusLessonRepository userStatusLessonRepository;
    private final PracticeResultRepository practiceResultRepository;

    //Tạo bản ghi mới ở user_topic_status khi admin chuyển topic sang public
    @Transactional
    @Override
    public void unlockNewlyPublishedTopicForUsers(Integer topicId) {
        log.info("Bắt đầu mở khóa chủ đề với ID = {}", topicId);
        var currentTopic = topicRepository.findById(topicId)
                .orElseThrow(() -> new AppException(ExceptionCode.CHU_DE_KHONG_TON_TAI));

        int position = currentTopic.getPosition();
        List<String> userIds = userTopicStatusRepository.findUserIdsToUnlockTopic(position, topicId);

        if (userIds.isEmpty()) {
            log.info("Không có user nào đủ điều kiện");
            return;
        }

        // 1️ Lấy toàn bộ lesson của topic
        List<Integer> lessonIds = lessonRepository.findLessonIdsByTopicId(topicId);
        if (lessonIds.isEmpty()) {
            log.warn("Topic {} không có lesson nào", topicId);
            return;
        }

        // 2️ Insert vào user_topic_status
        List<UserTopicStatus> topicStatusList = userIds.stream()
                .map(uid -> UserTopicStatus.builder()
                        .userId(uid)
                        .topic(currentTopic)
                        .progressStatus(ProgressStatus.UNLOCKED)
                        .build())
                .toList();
        userTopicStatusRepository.batchInsertUserStatusTopic(topicStatusList, 1000);

      // 3️ Insert toàn bộ lesson vào user_lesson_status, tránh duplicate
        List<UserLessonStatus> lessonStatusList = new ArrayList<>();
        for (String uid : userIds) {
            // Lấy danh sách lesson mà user đã có
            List<Integer> existingLessonIds = userStatusLessonRepository
                    .findExistingLessonIdsForUser(uid, lessonIds);

            for (Integer lessonId : lessonIds) {
                if (!existingLessonIds.contains(lessonId)) { // chỉ insert nếu chưa có
                    Lesson lesson = new Lesson();
                    lesson.setId(lessonId);

                    UserLessonStatus status = UserLessonStatus.builder()
                            .userId(uid)
                            .lesson(lesson)
                            .progressStatus(ProgressStatus.UNLOCKED)
                            .build();

                    lessonStatusList.add(status);
                }
            }
        }
        userStatusLessonRepository.batchInsertUserStatusLesson(lessonStatusList, 1000);

        log.info("Đã mở khóa topic {} và {} lesson cho {} user", topicId, lessonIds.size(), userIds.size());
    }


    @Override
    public List<TopicWithStatusDTO> findTopicsWithStatusByUser() {
        String userId = authHelper.getUserId();

        // Lấy danh sách topic
        List<TopicWithStatusDTO> topics =
                userTopicStatusRepository.findPublishedTopicsWithStatus(userId);

        // Lấy danh sách lesson kèm status (gọi 1 lần)
        Map<String, List<LessonWithStatusDTO>> lessonMap =
                userLessonStatusService.getLessonsWithStatusByUserAndTopic(userId);

        for (TopicWithStatusDTO topic : topics) {
            List<LessonWithStatusDTO> lessons =
                    new ArrayList<>(lessonMap.getOrDefault(topic.getTopicCode(), new ArrayList<>()));

            topic.setListLesson(lessons);

            LessonWithStatusDTO practiceLesson = buildPracticeLesson(userId, topic);
            lessons.add(practiceLesson);
        }

        return topics;
    }


    private LessonWithStatusDTO buildPracticeLesson(String userId, TopicWithStatusDTO topicWithStatusDTO) {
        // Kiểm tra tất cả lesson thật đã pass chưa
        boolean allLessonsPassed = userStatusLessonRepository.areAllLessonsPassed(userId, topicWithStatusDTO.getTopicCode());
        boolean checkPractice = practiceResultRepository.existsPassedPractice(userId,topicWithStatusDTO.getTopicCode(),ResultStatus.PASSED);

        int lastPosition = topicWithStatusDTO.getListLesson().stream()
                .mapToInt(LessonWithStatusDTO::getPosition)
                .max()
                .orElse(0);

        // tạo lesson ảo “Ôn tập”
        LessonWithStatusDTO dto = new LessonWithStatusDTO();
        dto.setLessonCode(topicWithStatusDTO.getTopicCode());
        dto.setLessonName("Ôn tập");
        dto.setTopicCode(topicWithStatusDTO.getTopicCode());
        dto.setPosition(lastPosition + 1);
        if (checkPractice){
            dto.setStatus(ProgressStatus.PASSED);
        }
        else if (allLessonsPassed) {
            dto.setStatus(ProgressStatus.UNLOCKED);
        } else {
            dto.setStatus(ProgressStatus.LOCKED);
        }

        return dto;
    }


    @Override
    public void updateTopicStatusAndUnlockNext(String userId, Topic currentTopic, ProgressStatus newStatus) {
        // Cập nhật trạng thái hiện tại của topic đó
        UserTopicStatus userTopicStatus = userTopicStatusRepository.findByUserIdAndTopicId(userId, currentTopic.getId())
                .orElseThrow(() -> new AppException(ExceptionCode.USER_TOPIC_STATUS_NOT_FOUND));

        // Nếu đã PASS rồi thì không cần cập nhật nữa
        if (userTopicStatus.getProgressStatus() == ProgressStatus.PASSED) {
            log.debug("User {} đã PASS topic {} trước đó -> không cập nhật", userId, currentTopic.getId());
            return;
        }

        userTopicStatus.setProgressStatus(newStatus);
        userTopicStatusRepository.save(userTopicStatus);
        log.debug("Cập nhật trạng thái topic {} cho user {} thành {}", currentTopic.getId(), userId, newStatus);

        // Nếu topic đã pass thì mở khóa topic tiếp theo (nếu có và đã PUBLISHED)
        if (newStatus == ProgressStatus.PASSED) {
            List<Topic> nextTopics = topicRepository.findNextPublishedTopic(
                    LearningStatus.PUBLISHED,
                    currentTopic.getPosition()

            );

            if (!nextTopics.isEmpty()) {
                Topic nextTopic = nextTopics.get(0);
                log.debug("Mở khóa topic tiếp theo {} cho user {}", nextTopic.getId(), userId);

                userTopicStatusRepository.findByUserIdAndTopicId(userId, nextTopic.getId())
                        .orElseGet(() -> {
                            UserTopicStatus nextTopicStatus = new UserTopicStatus();
                            nextTopicStatus.setProgressStatus(ProgressStatus.UNLOCKED);
                            nextTopicStatus.setUserId(userId);
                            nextTopicStatus.setTopic(nextTopic);
                            nextTopicStatus.setCompletedAt(Instant.now());
                            return userTopicStatusRepository.save(nextTopicStatus);
                        });
                userLessonStatusService.unlockFirstLessonOfTopic(userId, nextTopic);
            } else {
                log.info("User {} đã hoàn thành topic cuối {} -> Không còn topic nào để unlock",
                        userId, currentTopic.getId());
            }
        }
    }

    @Override
    @Transactional
    public void createTopicForUserAfterTest(Integer correctQuestion) {
        String userId = authHelper.getUserId();
        log.info("Bắt đầu tạo topic cho user {} sau bài test, số câu đúng = {}", userId, correctQuestion);

        // Lấy 3 topic đã publish (theo thứ tự position)
        List<Topic> topics = topicRepository.findFirstPublishedTopics(
                LearningStatus.PUBLISHED,
                PageRequest.of(0, 3)
        );
        log.debug("Tìm thấy {} topic đã publish: {}", topics.size(), topics.stream().map(Topic::getId).toList());

        if (topics.size() < 2) {
            log.warn("Không đủ topic để mở cho user {}. Yêu cầu tối thiểu 2 topic", userId);
            return;
        }

        int fullUnlockCount = 0;
        int nextLessonIndex = -1;

        if (correctQuestion < 4) {
            // Mở bài học đầu tiên của topic đầu tiên
            nextLessonIndex = 0;
        } else if (correctQuestion <= 6) {
            fullUnlockCount = 1;   // Mở toàn bộ topic đầu tiên
            nextLessonIndex = 1;   // Mở bài học đầu tiên của topic thứ hai
        } else if (correctQuestion <= 8) {
            fullUnlockCount = 2;   // Mở toàn bộ topic 1 và 2
            nextLessonIndex = 2;   // Mở bài học đầu tiên của topic thứ ba
        } else {
            log.info("User {} có {} câu đúng, không mở thêm topic nào", userId, correctQuestion);
        }

        // Mở toàn bộ các topic cần unlock
        topics.stream()
                .limit(fullUnlockCount)
                .forEach(topic -> {
                    log.debug("Mở toàn bộ topic {} cho user {}", topic.getId(), userId);
                    unlockTopicAndLessons(topic);
                });

        // Nếu có topic cần mở bài học đầu tiên
        if (nextLessonIndex >= 0 && nextLessonIndex < topics.size()) {
            Topic nextTopic = topics.get(nextLessonIndex);

            // Mở topic trước (nếu chưa mở)
            unlockTopicOnly(nextTopic);

            // Sau đó mở bài học đầu tiên
            log.debug("Mở bài học đầu tiên của topic {} cho user {}", nextTopic.getId(), userId);
            userLessonStatusService.unlockFirstLessonOfTopic(userId, nextTopic);
        }
    }

    private void unlockTopicOnly(Topic topic) {
        String userId = authHelper.getUserId();
        log.debug("Mở topic {} cho user {}", topic.getId(), userId);

        userTopicStatusRepository.save(
                UserTopicStatus.builder()
                        .userId(userId)
                        .topic(topic)
                        .progressStatus(ProgressStatus.UNLOCKED)
                        .completedAt(Instant.now())
                        .build()
        );
    }

    private void unlockTopicAndLessons(Topic topic) {
        unlockTopicOnly(topic);

        String userId = authHelper.getUserId();
        List<UserLessonStatus> lessonStatuses = lessonRepository.findLessonIdsByTopicId(topic.getId())
                .stream()
                .map(lessonId -> {
                    Lesson lesson = new Lesson();
                    lesson.setId(lessonId);
                    return UserLessonStatus.builder()
                            .userId(userId)
                            .lesson(lesson)
                            .progressStatus(ProgressStatus.UNLOCKED)
                            .completedAt(Instant.now())
                            .build();
                })
                .toList();

        userStatusLessonRepository.saveAll(lessonStatuses);
        log.debug("Đã mở {} lessons cho topic {} của user {}", lessonStatuses.size(), topic.getId(), userId);
    }


}

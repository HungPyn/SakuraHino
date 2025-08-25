package com.sakurahino.learningservice.service.impl;

import com.sakurahino.ampqclient.RabbitMQMessageProducer;
import com.sakurahino.clients.commons.RabbitKey;
import com.sakurahino.clients.rabitmqModel.learning.UserIsNewUpdateMessageDTO;
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
import com.sakurahino.common.util.TimeUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

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
    private final RabbitMQMessageProducer rabbitMQMessageProducer;

    //Tạo bản ghi mới ở user_topic_status khi admin chuyển topic sang public
    @Transactional
    @Override
    public void unlockNewlyPublishedTopicForUsers(Integer topicId) {
        log.info("Bắt đầu mở khóa chủ đề với ID = {}", topicId);
        var currentTopic = topicRepository.findById(topicId)
                .orElseThrow(() -> new AppException(ExceptionCode.CHU_DE_KHONG_TON_TAI));

        int position = currentTopic.getPosition();

        // 1️⃣ User đủ điều kiện theo position nhỏ hơn
        List<String> userIdsByPosition = userTopicStatusRepository.findUserIdsToUnlockTopic(position, topicId);

        // 2️⃣ User đã pass topic trước đó (previousPosition)
        List<String> userIdsByPassedPrevious = userTopicStatusRepository
                .findUserIdsToUnlockTopicByPassedPreviousTopic(position);

        // Gộp danh sách user
        Set<String> userIds = new HashSet<>();
        userIds.addAll(userIdsByPosition);
        userIds.addAll(userIdsByPassedPrevious);

        log.info("Số lượng user sẽ được cập nhật: {}", userIds.size());
        if (userIds.isEmpty()) {
            log.info("Không có user nào đủ điều kiện");
            return;
        }

        // 3️⃣ Lấy toàn bộ lesson của topic
        List<Integer> lessonIds = lessonRepository.findLessonIdsByTopicId(topicId);
        Instant now = TimeUtils.nowInstant();

        // 4️⃣ Insert user_topic_status
        List<UserTopicStatus> topicStatusList = userIds.stream()
                .map(uid -> UserTopicStatus.builder()
                        .userId(uid)
                        .topic(currentTopic)
                        .progressStatus(ProgressStatus.UNLOCKED)
                        .completedAt(now)
                        .build())
                .toList();
        userTopicStatusRepository.batchInsertUserStatusTopic(topicStatusList, 1000);

        // 5️⃣ Insert user_lesson_status nếu có lesson
        if (!lessonIds.isEmpty()) {
            List<UserLessonStatus> lessonStatusList = new ArrayList<>();
            for (String uid : userIds) {
                List<Integer> existingLessonIds = userStatusLessonRepository
                        .findExistingLessonIdsForUser(uid, lessonIds);

                for (Integer lessonId : lessonIds) {
                    if (!existingLessonIds.contains(lessonId)) {
                        Lesson lesson = new Lesson();
                        lesson.setId(lessonId);

                        UserLessonStatus status = UserLessonStatus.builder()
                                .userId(uid)
                                .lesson(lesson)
                                .progressStatus(ProgressStatus.UNLOCKED)
                                .completedAt(now)
                                .build();

                        lessonStatusList.add(status);
                    }
                }
            }
            userStatusLessonRepository.batchInsertUserStatusLesson(lessonStatusList, 1000);
        }

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
        boolean checkPractice = practiceResultRepository.existsPassedPractice(userId, topicWithStatusDTO.getTopicCode(), ResultStatus.PASSED);
        log.info("Check practice passed for user {} topic {} = {}", userId, topicWithStatusDTO.getTopicCode(), checkPractice);

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
        if (checkPractice) {
            dto.setStatus(ProgressStatus.PASSED);
        } else if (allLessonsPassed) {
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
                            nextTopicStatus.setCompletedAt(TimeUtils.nowInstant());
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
                    unlockTopicAndLessonsSafe(topic);
                });

        // Nếu có topic cần mở bài học đầu tiên
        if (nextLessonIndex >= 0 && nextLessonIndex < topics.size()) {
            Topic nextTopic = topics.get(nextLessonIndex);

            // Mở topic trước (nếu chưa mở)
            unlockTopicOnlySafe(nextTopic);

            // Sau đó mở bài học đầu tiên
            log.debug("Mở bài học đầu tiên của topic {} cho user {}", nextTopic.getId(), userId);
            userLessonStatusService.unlockFirstLessonOfTopic(userId, nextTopic);
        }
        UserIsNewUpdateMessageDTO messageDTO = new UserIsNewUpdateMessageDTO();
        messageDTO.setUserId(userId);
        messageDTO.setIsNew(false);
        rabbitMQMessageProducer
                .publish(messageDTO,
                        RabbitKey.EXCHANGE_LEARNING
                        ,RabbitKey.ROUTING_USER_UPDATE_IS_NEW_USER);
    }

    private void unlockTopicOnlySafe(Topic topic) {
        String userId = authHelper.getUserId();
        log.debug("Mở topic {} cho user {}", topic.getId(), userId);

        boolean exists = userTopicStatusRepository.existsByUserIdAndTopicId(userId, topic.getId());
        if (!exists) {
            userTopicStatusRepository.save(
                    UserTopicStatus.builder()
                            .userId(userId)
                            .topic(topic)
                            .progressStatus(ProgressStatus.UNLOCKED)
                            .completedAt(TimeUtils.nowInstant())
                            .build()
            );
            log.debug("Topic {} đã được unlock cho user {}", topic.getId(), userId);
        } else {
            log.debug("User {} đã có topic {}, không insert lại", userId, topic.getId());
        }
    }

    private void unlockTopicAndLessonsSafe(Topic topic) {
        String userId = authHelper.getUserId();

        // 1️⃣ Unlock topic nếu chưa unlock
        unlockTopicOnlySafe(topic);

        // 2️⃣ Lấy tất cả lesson của topic
        List<Integer> lessonIds = lessonRepository.findLessonIdsByTopicId(topic.getId());
        if (lessonIds.isEmpty()) {
            log.debug("Topic {} không có lesson để unlock cho user {}", topic.getId(), userId);
            return;
        }

        // 3️⃣ Lấy danh sách lesson mà user đã có (1 query duy nhất)
        List<Integer> existingLessonIds = userStatusLessonRepository.findExistingLessonIdsForUser(userId, lessonIds);

        // 4️⃣ Chỉ insert lesson chưa có
        List<UserLessonStatus> userLessonStatuses = new ArrayList<>();
        Instant now = TimeUtils.nowInstant();
        for (Integer lessonId : lessonIds) {
            if (!existingLessonIds.contains(lessonId)) {
                Lesson lesson = new Lesson();
                lesson.setId(lessonId);

                userLessonStatuses.add(
                        UserLessonStatus.builder()
                                .userId(userId)
                                .lesson(lesson)
                                .progressStatus(ProgressStatus.UNLOCKED)
                                .completedAt(now)
                                .build()
                );
            }
        }

        // 5️⃣ Batch insert
        if (!userLessonStatuses.isEmpty()) {
            userStatusLessonRepository.batchInsertUserStatusLesson(userLessonStatuses, 1000);
            log.debug("Đã mở {} lessons cho topic {} của user {}", userLessonStatuses.size(), topic.getId(), userId);
        }
    }

}

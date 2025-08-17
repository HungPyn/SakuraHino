package com.sakurahino.learningservice.service.impl;

import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.security.AuthHelper;
import com.sakurahino.learningservice.dto.lesson.LessonWithStatusDTO;
import com.sakurahino.learningservice.dto.topic.TopicWithStatusDTO;
import com.sakurahino.learningservice.entity.Topic;
import com.sakurahino.learningservice.entity.UserTopicStatus;
import com.sakurahino.learningservice.enums.LearningStatus;
import com.sakurahino.learningservice.enums.ProgressStatus;
import com.sakurahino.learningservice.enums.ResultStatus;
import com.sakurahino.learningservice.repository.PracticeResultRepository;
import com.sakurahino.learningservice.repository.TopicRepository;
import com.sakurahino.learningservice.repository.UserStatusLessonRepository;
import com.sakurahino.learningservice.repository.UserTopicStatusRepository;
import com.sakurahino.learningservice.service.UserLessonStatusService;
import com.sakurahino.learningservice.service.UserTopicStatusService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    private final AuthHelper authHelper;
    private final UserLessonStatusService userLessonStatusService;
    private final UserStatusLessonRepository userStatusLessonRepository;
    private final PracticeResultRepository practiceResultRepository;

    //Tạo bản ghi mới ở user_topic_status khi admin chuyển topic sang public
    @Override
    @Transactional
    public void unlockNewlyPublishedTopicForUsers(Integer topicId) {
        log.info("Bắt đầu mở khóa chủ đề với ID = {}", topicId);

        var currentTopic = topicRepository.findById(topicId)
                .orElseThrow(() -> new AppException(ExceptionCode.CHU_DE_KHONG_TON_TAI));

        int position = currentTopic.getPosition();

        List<String> listUserIds = userTopicStatusRepository.findUserIdsToUnlockTopic(position, topicId);
        log.info("Tìm thấy {} người dùng cần được mở khóa chủ đề ID = {}", listUserIds.size(), topicId);

        if (listUserIds.isEmpty()) {
            log.info("Không có người dùng nào cần mở khóa cho chủ đề ID = {}", topicId);
            return;
        }

        List<UserTopicStatus> listInsert = new ArrayList<>();
        for (String userId : listUserIds) {
            UserTopicStatus item = new UserTopicStatus();
            item.setUserId(userId);
            item.setTopic(currentTopic);
            item.setProgressStatus(ProgressStatus.UNLOCKED);
            item.setCompletedAt(Instant.now());
            listInsert.add(item);
        }

        userTopicStatusRepository.batchInsertUserStatusTopic(listInsert, 1000);
        log.info("Đã thêm {} bản ghi UserTopicStatus mới cho chủ đề ID = {}", listInsert.size(), topicId);
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

}

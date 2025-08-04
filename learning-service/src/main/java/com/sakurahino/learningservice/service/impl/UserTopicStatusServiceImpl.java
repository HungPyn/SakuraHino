package com.sakurahino.learningservice.service.impl;

import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.security.AuthHelper;
import com.sakurahino.learningservice.dto.lesson.LessonWithStatusDTO;
import com.sakurahino.learningservice.dto.topic.TopicWithStatusDTO;
import com.sakurahino.learningservice.entity.Topic;
import com.sakurahino.learningservice.entity.UserTopicStatus;
import com.sakurahino.learningservice.enums.ProgressStatus;
import com.sakurahino.learningservice.repository.TopicRepository;
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
        List<TopicWithStatusDTO> listTopicWithStatusDTO
                = userTopicStatusRepository.findPublishedTopicsWithStatus(authHelper.getUserId());
        Map<String, List<LessonWithStatusDTO>> lessonMap =
                userLessonStatusService.getLessonsWithStatusByUserAndTopic(userId);

        for (TopicWithStatusDTO data : listTopicWithStatusDTO) {
            data.setListLesson(lessonMap.getOrDefault(data.getTopicCode(), new ArrayList<>()));
        }

        return listTopicWithStatusDTO;
    }

}

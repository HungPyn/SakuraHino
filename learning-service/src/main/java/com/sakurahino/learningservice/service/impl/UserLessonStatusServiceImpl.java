package com.sakurahino.learningservice.service.impl;

import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.learningservice.dto.lesson.LessonWithStatusDTO;
import com.sakurahino.learningservice.entity.Lesson;
import com.sakurahino.learningservice.entity.UserLessonStatus;
import com.sakurahino.learningservice.enums.LearningStatus;
import com.sakurahino.learningservice.enums.ProgressStatus;
import com.sakurahino.learningservice.repository.LessonRepository;
import com.sakurahino.learningservice.repository.UserStatusLessonRepository;
import com.sakurahino.learningservice.service.UserLessonStatusService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserLessonStatusServiceImpl implements UserLessonStatusService {

    private final UserStatusLessonRepository userStatusLessonRepository;
    private final LessonRepository lessonRepository;

    @Override
    @Transactional
    public void unlockNewlyPublishedLessonForUsers(Integer lessonId) {
        log.info("Bắt đầu mở khóa lesson với ID = {}", lessonId);
        var currentLesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(ExceptionCode.LESSON_KHONG_TON_TAI));
        int position = currentLesson.getPosition();
        List<String> listUserIds = userStatusLessonRepository.findUserIdToUnlockLesson(position, lessonId);

        if (listUserIds.isEmpty()) {
            log.info("Không có người dùng nào cần mở khóa bài học ID={} (position={})", lessonId, position);
            return;
        }

        log.info("Mở khóa bài học ID={} (position={}) cho {} người dùng", lessonId, position, listUserIds.size());

        List<UserLessonStatus> listInsert = new ArrayList<>();
        for (String userId : listUserIds) {
            UserLessonStatus item = new UserLessonStatus();
            item.setUserId(userId);
            item.setLesson(currentLesson);
            item.setProgressStatus(ProgressStatus.UNLOCKED);
            item.setCompletedAt(Instant.now());
            listInsert.add(item);
        }
        userStatusLessonRepository.batchInsertUserStatusLesson(listInsert, 1000);
    }

    @Override
    public Map<String, List<LessonWithStatusDTO>> getLessonsWithStatusByUserAndTopic(String userId) {
        List<LessonWithStatusDTO> listAllLesson = userStatusLessonRepository.findAllPublishedLessonsWithStatusByUser(userId);
        return listAllLesson.stream()
                .collect(Collectors.groupingBy(LessonWithStatusDTO::getTopicCode,
                        LinkedHashMap::new,
                        Collectors.toList()));
    }

    @Override
    public void updateLessonStatusAndUnlockNext(String userId, Lesson currentLesson, ProgressStatus newStatus) {
        // Cập nhập trạng thái hiện tại của lesson đó
        UserLessonStatus userLessonStatus = userStatusLessonRepository.findByUserIdAndLessonId(userId, currentLesson.getId())
                .orElseThrow(() -> new AppException(ExceptionCode.USER_LESSON_STATUS_NOT_FOUND));

        // Nếu đã pass rồi thì không làm gì nữa
        if (userLessonStatus.getProgressStatus() == ProgressStatus.PASSED) {
            log.debug("User {} đã PASS lesson {} trước đó -> không cập nhật", userId, currentLesson.getId());
            return;
        }

        userLessonStatus.setProgressStatus(newStatus);
        userStatusLessonRepository.save(userLessonStatus);
        log.debug("Cập nhật trạng thái lesson {} cho user {} thành {}", currentLesson.getId(), userId, newStatus);

        // Nếu lesson đã pass thì tìm bài tiếp theo để unlock
        if (newStatus == ProgressStatus.PASSED) {
            List<Lesson> nextLessons = lessonRepository.findNextPublishedLesson(
                    currentLesson.getTopic().getId(),
                    LearningStatus.PUBLISHED,
                    currentLesson.getPosition()
            );

            if (!nextLessons.isEmpty()) {
                Lesson nextLesson = nextLessons.get(0);
                log.debug("Mở khóa bài học tiếp theo {} cho user {}", nextLesson.getId(), userId);

                userStatusLessonRepository.findByUserIdAndLessonId(userId, nextLesson.getId())
                        .orElseGet(() -> {
                            UserLessonStatus nextLessonStatus = new UserLessonStatus();
                            nextLessonStatus.setProgressStatus(ProgressStatus.UNLOCKED);
                            nextLessonStatus.setCompletedAt(Instant.now());
                            nextLessonStatus.setUserId(userId);
                            nextLessonStatus.setLesson(nextLesson);
                            return userStatusLessonRepository.save(nextLessonStatus);
                        });
            } else {
                log.info("User {} đã hoàn thành bài cuối {} trong topic {} -> UI sẽ tự unlock bài Ôn tập",
                        userId, currentLesson.getId(), currentLesson.getTopic().getId());
            }
        }
    }

}

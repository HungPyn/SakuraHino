package com.sakurahino.learningservice.service.impl;

import com.sakurahino.ampqclient.RabbitMQMessageProducer;
import com.sakurahino.clients.commons.RabbitKey;
import com.sakurahino.clients.rabitmqModel.learning.StreakAndExpUpdateMessageDTO;
import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.security.AuthHelper;
import com.sakurahino.learningservice.dto.result.LessonResultRequestDTO;
import com.sakurahino.learningservice.dto.result.LessonResultResponseDTO;
import com.sakurahino.learningservice.entity.Lesson;
import com.sakurahino.learningservice.entity.LessonResult;
import com.sakurahino.learningservice.entity.UserLessonStatus;
import com.sakurahino.learningservice.enums.LearningStatus;
import com.sakurahino.learningservice.enums.ProgressStatus;
import com.sakurahino.learningservice.enums.ResultStatus;
import com.sakurahino.learningservice.mapper.ResultMapper;
import com.sakurahino.learningservice.repository.LessonRepository;
import com.sakurahino.learningservice.repository.LessonResultRepository;
import com.sakurahino.learningservice.repository.PracticeResultRepository;
import com.sakurahino.learningservice.repository.UserStatusLessonRepository;
import com.sakurahino.learningservice.service.LessonResultService;
import com.sakurahino.learningservice.service.UserLessonStatusService;
import com.sakurahino.learningservice.utils.TimeUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class LessonResultServiceImpl implements LessonResultService {

    private static final int XP_PER_CORRECT = 10; // 1 câu đúng = 10 XP

    private final LessonResultRepository lessonResultRepository;
    private final LessonRepository lessonRepository;
    private final AuthHelper authHelper;
    private final ResultMapper resultMapper;
    private final UserLessonStatusService userLessonStatusService;
    private final RabbitMQMessageProducer rabbitMQProducer;
    private final PracticeResultRepository practiceResultRepository;
    private final UserStatusLessonRepository userStatusLessonRepository;

    @Override
    public LessonResultResponseDTO create(LessonResultRequestDTO dto) {
        Lesson lesson = lessonRepository.findByCode(dto.getLessonCode());
        if (lesson == null) {
            throw new AppException(ExceptionCode.LESSON_KHONG_TON_TAI);
        }
        if (lesson.getStatus() != LearningStatus.PUBLISHED){
            throw new AppException(ExceptionCode.LESSON_STATUS_DONT_PUBLISHED);
        }
        String userId = authHelper.getUserId();
        UserLessonStatus userLessonStatus = userStatusLessonRepository
                .findByUserIdAndLessonId(userId, lesson.getId())
                .orElseThrow(() -> new AppException(ExceptionCode.USER_LESSON_STATUS_NOT_FOUND));

        // Xác định điểm cao nhất trước đó
        Integer bestCorrectBefore = lessonResultRepository
                .findMaxCorrectCountByUserIdAndLessonId(userId, lesson.getId())
                .orElse(0);

        LessonResult lessonResult = buildLessonResult(dto, lesson);

        // ===== Tính XP =====
        int currentCorrect = lessonResult.getCorrectCount();
        int xpAmount = Math.max(0, (currentCorrect - bestCorrectBefore) * XP_PER_CORRECT);

        // ===== Tính streak =====
        log.info("Checking first lesson today for user {}", userId);
        int streakIncrement = isFirstLessonToday(userId,lessonResult.getCompletedAt()) ? 1 : 0;
        log.info("streakIncrement={}", streakIncrement);

        lessonResultRepository.save(lessonResult);

        if (lessonResult.getStatus() == ResultStatus.PASSED) {
            userLessonStatusService.updateLessonStatusAndUnlockNext(
                    userId,
                    lesson,
                    ProgressStatus.PASSED
            );
        }

        if (xpAmount > 0 || streakIncrement > 0) {
            StreakAndExpUpdateMessageDTO message = new StreakAndExpUpdateMessageDTO(
                    userId,
                    xpAmount,
                    streakIncrement,
                    Instant.now()
            );

            rabbitMQProducer.publish(
                    message,
                    RabbitKey.EXCHANGE_LEARNING,
                    RabbitKey.ROUTING_USER_UPDATE_STREAK_AND_EXP
            );
        }

        return resultMapper.toLessonResultResponseDTO(lessonResult);
    }

    private LessonResult buildLessonResult(LessonResultRequestDTO dto, Lesson lesson) {
        Instant completedAt = TimeUtils.nowInstant(); // giờ VN
        Instant startTime = completedAt.minusSeconds(dto.getDurationSeconds());

        LessonResult lessonResult = new LessonResult();
        lessonResult.setLesson(lesson);
        lessonResult.setScore(dto.getScore());
        lessonResult.setCorrectCount(dto.getCorrectCount());
        lessonResult.setWrongCount(dto.getWrongCount());
        lessonResult.setStatus(dto.getScore() >= 70 ? ResultStatus.PASSED : ResultStatus.FAILED);
        lessonResult.setCompletedAt(completedAt);
        lessonResult.setStartTime(startTime);
        lessonResult.setTotalQuestion(dto.getTotalQuestion());
        lessonResult.setUserId(authHelper.getUserId());

        return lessonResult;
    }

    // Kiểm tra lần đầu làm bài trong ngày (trước thời điểm hiện tại)
    protected boolean isFirstLessonToday(String userId, Instant currentTime) {
        // 00:00 giờ VN hôm nay
        Instant startOfDay = TimeUtils.startOfDayInstant(); // phương thức trả về 00:00 giờ VN hôm nay

        boolean lessonExists = lessonResultRepository.existsByUserIdAndStatusBetween(
                userId, ResultStatus.PASSED, startOfDay, currentTime
        );

        boolean practiceExists = practiceResultRepository.existsByUserIdAndStatusAfter(
                userId, ResultStatus.PASSED, startOfDay, currentTime
        );

        log.info("User {} đã làm bài hôm nay? Lesson: {}, Practice: {}",
                userId, lessonExists, practiceExists);
        log.debug("StartOfDay (VN): {}, CurrentTime: {}", startOfDay, currentTime);

        // Nếu chưa có lesson hoặc practice nào → là lần đầu
        return !(lessonExists || practiceExists);
    }
}

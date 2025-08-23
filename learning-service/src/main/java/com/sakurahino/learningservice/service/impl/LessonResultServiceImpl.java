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
import com.sakurahino.common.util.TimeUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;

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
        if (lesson.getStatus() != LearningStatus.PUBLISHED) {
            throw new AppException(ExceptionCode.LESSON_STATUS_DONT_PUBLISHED);
        }
        String userId = authHelper.getUserId();
        UserLessonStatus userLessonStatus = userStatusLessonRepository
                .findByUserIdAndLessonId(userId, lesson.getId())
                .orElseThrow(() -> new AppException(ExceptionCode.USER_LESSON_STATUS_NOT_FOUND));

        // Xác định điểm cao nhất trước đó
        Integer bestCorrectBefore = lessonResultRepository
                .findMaxCorrectCountByUserIdAndLessonIdAndStatus(userId, lesson.getId(),ResultStatus.PASSED)
                .orElse(0);

        LessonResult lessonResult = buildLessonResult(dto, lesson);
        int xpAmount = 0;
        int streakIncrement = 0;
        // ===== Tính streak =====
        log.info("Checking first lesson today for user {}", userId);
        streakIncrement = isFirstPassedToday(userId, lessonResult.getCompletedAt()) ? 1 : 0;
        log.info("streakIncrement={}", streakIncrement);

        lessonResultRepository.save(lessonResult);

        if (lessonResult.getStatus() == ResultStatus.PASSED) {
            // ===== Tính XP =====
            int currentCorrect = lessonResult.getCorrectCount();
             xpAmount = Math.max(0, (currentCorrect - bestCorrectBefore) * XP_PER_CORRECT);


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
                    TimeUtils.nowInstant()
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
    protected boolean isFirstPassedToday(String userId, Instant currentTime) {
        Instant startOfDay = TimeUtils.startOfDayInstant(); // 00:00 giờ VN hôm nay

        boolean lessonPassed = lessonResultRepository.existsByUserIdAndStatusBetween(
                userId, ResultStatus.PASSED, startOfDay, currentTime
        );

        boolean practicePassed = practiceResultRepository.existsByUserIdAndStatusBetween(
                userId, ResultStatus.PASSED, startOfDay, currentTime
        );

        log.info("User {} đã có PASSED hôm nay? Lesson: {}, Practice: {}", userId, lessonPassed, practicePassed);
        log.debug("StartOfDay (VN): {}, CurrentTime: {}", startOfDay, currentTime);

        return !(lessonPassed || practicePassed);
    }
}

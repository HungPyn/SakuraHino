package com.sakurahino.learningservice.service.impl;

import com.sakurahino.ampqclient.RabbitMQMessageProducer;
import com.sakurahino.clients.commons.RabbitKey;
import com.sakurahino.clients.rabitmqModel.learning.StreakAndExpUpdateMessageDTO;
import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.security.AuthHelper;
import com.sakurahino.learningservice.dto.result.PracticeResultRequestDTO;
import com.sakurahino.learningservice.dto.result.PracticeResultResponseDTO;
import com.sakurahino.learningservice.entity.PracticeResult;
import com.sakurahino.learningservice.entity.Topic;
import com.sakurahino.learningservice.enums.ProgressStatus;
import com.sakurahino.learningservice.enums.ResultStatus;
import com.sakurahino.learningservice.mapper.ResultMapper;
import com.sakurahino.learningservice.repository.LessonResultRepository;
import com.sakurahino.learningservice.repository.PracticeResultRepository;
import com.sakurahino.learningservice.repository.TopicRepository;
import com.sakurahino.learningservice.service.PracticeResultService;
import com.sakurahino.learningservice.service.UserTopicStatusService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

@Service
@Slf4j
@RequiredArgsConstructor
public class PracticeResultServiceImpl implements PracticeResultService {

    private static final int XP_PER_CORRECT = 10;

    private final PracticeResultRepository practiceResultRepository;
    private final TopicRepository topicRepository;
    private final AuthHelper authHelper;
    private final RabbitMQMessageProducer rabbitMQProducer;
    private final ResultMapper  resultMapper;
    private final UserTopicStatusService userTopicStatusService;
    private final LessonResultServiceImpl lessonResultService;

    @Override
    public PracticeResultResponseDTO create(PracticeResultRequestDTO dto) {
        Topic topic = topicRepository.findByCode(dto.getTopicCode());
        if (topic == null) {
            throw new AppException(ExceptionCode.CHU_DE_KHONG_TON_TAI);
        }
        String userId = authHelper.getUserId();

        // Lấy số câu đúng cao nhất trước đó
        Integer bestCorrectBefore = practiceResultRepository
                .findMaxCorrectCountByUserIdAndTopicId(userId, topic.getId())
                .orElse(0);

        PracticeResult practiceResult = buildPracticeResult(dto, topic);
        practiceResultRepository.save(practiceResult);

        // Nếu PASS thì update status và mở khóa topic tiếp theo
        if (practiceResult.getStatus() == ResultStatus.PASSED) {


            // ===== Tính XP =====
            int currentCorrect = practiceResult.getCorrectCount();
            int xpAmount = Math.max(0, (currentCorrect - bestCorrectBefore) * XP_PER_CORRECT);

            // ===== Tính streak =====
            int streakIncrement = lessonResultService.isFirstLessonToday(userId) ? 1 : 0;

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

            userTopicStatusService.updateTopicStatusAndUnlockNext(userId, topic, ProgressStatus.PASSED);
        }

        return resultMapper.toPracticeResultResponseDTO(practiceResult);
    }

    private PracticeResult buildPracticeResult(PracticeResultRequestDTO dto, Topic topic) {
        Instant completedAt = Instant.now();
        Instant startTime = completedAt.minusSeconds(dto.getDurationSeconds());

        PracticeResult result = new PracticeResult();
        result.setTopic(topic);
        result.setScore(dto.getScore());
        result.setCorrectCount(dto.getCorrectCount());
        result.setWrongCount(dto.getWrongCount());
        result.setStatus(dto.getScore() >= 70 ? ResultStatus.PASSED : ResultStatus.FAILED);
        result.setCompletedAt(completedAt);
        result.setStartTime(startTime);
        result.setTotalQuestion(dto.getTotalQuestion());
        result.setUserId(authHelper.getUserId());

        return result;
    }
}

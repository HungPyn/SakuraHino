package com.sakurahino.userservice.listener;


import com.sakurahino.clients.commons.RabbitKey;
import com.sakurahino.clients.rabitmqModel.learning.StreakAndExpUpdateMessageDTO;
import com.sakurahino.userservice.service.UserProgressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class LearningEventListener {

    private final UserProgressService userProgressService;

    @RabbitListener(queues = RabbitKey.QUEUE_USER_UPDATE_STREAK_AND_EXP)
    public void receiveUserUpdateStreamAndExp(StreakAndExpUpdateMessageDTO dto) {
        log.info(" Nhận message đăng ký thành công từ learning-service: {}", dto);

        userProgressService.updateExpAndStreak(dto.getUserId(),dto.getExpAmount(),dto.getLongStreak(),dto.getEventTime());
    }
}

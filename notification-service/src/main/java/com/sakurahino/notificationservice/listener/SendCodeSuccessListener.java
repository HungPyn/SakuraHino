package com.sakurahino.notificationservice.listener;

import com.sakurahino.clients.commons.RabbitKey;
import com.sakurahino.clients.rabitmqModel.SendResetCodeMessage;
import com.sakurahino.notificationservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class SendCodeSuccessListener {

    private final EmailService emailService;

    @RabbitListener(queues = RabbitKey.QUEUE_SEND_FORGOT_PASSWORD)
    public void onReceive(SendResetCodeMessage dto) {
        log.info(" Nhận message gửi mail thành công từ auth-service: {}", dto);

        emailService.sendResetPasswordMail(dto);
    }
}

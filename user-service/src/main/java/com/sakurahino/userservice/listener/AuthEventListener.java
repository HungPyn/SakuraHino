package com.sakurahino.userservice.listener;

import com.sakurahino.clients.commons.RabbitKey;
import com.sakurahino.clients.rabitmqModel.RegisterSuccessDTO;
import com.sakurahino.clients.rabitmqModel.UserLoggedInDTO;
import com.sakurahino.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthEventListener {

    private final UserService userService;

    @RabbitListener(queues = RabbitKey.QUEUE_REGISTER_SUCCESS)
    public void onReceive(RegisterSuccessDTO dto) {
        log.info(" Nhận message đăng ký thành công từ auth-service: {}", dto);

        userService.handleRegisterSuccess(dto);
    }

    @RabbitListener(queues = RabbitKey.QUEUE_USER_LOGGED_IN)
    public void handleUserLogin(UserLoggedInDTO dto) {
        log.info("Nhận message đăng nhập thành công từ auth-service: {}", dto);
        userService.markUserOnline(dto.getUserId());
    }
}
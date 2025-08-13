package com.sakurahino.authservice.listener;

import com.sakurahino.authservice.service.UserService;
import com.sakurahino.clients.commons.RabbitKey;
import com.sakurahino.clients.rabitmqModel.user.UserStatusMessageDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class UpdateStatusUserListener {
    private final UserService userService;

    @RabbitListener(queues = RabbitKey.QUEUE_USER_UPDATE)
    public void updateStatusForUser(UserStatusMessageDTO user) {
        log.info("Nhận update status thành công từ user-service {}", user);
        userService.updateUserStatus(user);
    }

}

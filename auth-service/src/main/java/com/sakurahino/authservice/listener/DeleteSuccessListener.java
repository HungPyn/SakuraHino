package com.sakurahino.authservice.listener;

import com.sakurahino.authservice.entity.User;
import com.sakurahino.authservice.service.UserService;
import com.sakurahino.clients.commons.RabbitKey;
import com.sakurahino.clients.rabitmqModel.UserDeletedDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DeleteSuccessListener {
    private final UserService userService;

    @RabbitListener(queues = RabbitKey.QUEUE_USER_DELETED)
    public void deleteUser(UserDeletedDTO user) {
        log.info("Nhận update status thành công từ user-service {}", user);
        userService.updateUserStatus(user);
    }
}

package com.sakurahino.authservice.service;

import com.sakurahino.clients.rabitmqModel.user.UserStatusMessageDTO;

public interface UserService {
    void updateUserStatus(UserStatusMessageDTO dto);

}

package com.sakurahino.authservice.service;

import com.sakurahino.clients.rabitmqModel.UserDeletedDTO;

public interface UserService {
    void updateUserStatus(UserDeletedDTO dto);
}

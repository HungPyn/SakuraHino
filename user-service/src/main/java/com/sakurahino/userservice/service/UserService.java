package com.sakurahino.userservice.service;

import com.sakurahino.clients.rabitmqModel.RegisterSuccessDTO;

public interface UserService {
    public void handleRegisterSuccess(RegisterSuccessDTO dto);
}

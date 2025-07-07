package com.sakurahino.userservice.service;

import com.sakurahino.clients.rabitmqModel.RegisterSuccessDTO;
import com.sakurahino.userservice.dto.ResponseUserDTO;

import java.util.List;

public interface UserService {
    void handleRegisterSuccess(RegisterSuccessDTO dto);

    void markUserOnline(String userId);

    boolean isUserOnline(String userId);

    //admin
    List<ResponseUserDTO> getAll();
}

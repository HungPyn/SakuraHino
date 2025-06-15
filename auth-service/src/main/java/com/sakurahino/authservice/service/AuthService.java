package com.sakurahino.authservice.service;

import com.sakurahino.authservice.dto.LoginRequestDTO;
import com.sakurahino.authservice.dto.LoginResponseDTO;
import com.sakurahino.authservice.dto.RegisterRequestDTO;

public interface AuthService {

    void register(RegisterRequestDTO dto);

    LoginResponseDTO login(LoginRequestDTO dto);

}

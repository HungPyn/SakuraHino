package com.sakurahino.authservice.controller;

import com.sakurahino.authservice.dto.LoginRequestDTO;
import com.sakurahino.authservice.dto.RegisterRequestDTO;
import com.sakurahino.authservice.retresponse.SuccessResponse;
import com.sakurahino.authservice.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public SuccessResponse register( @Valid @RequestBody RegisterRequestDTO dto) {
        authService.register(dto);
        return new SuccessResponse("Đăng ký thành công");
    }

    @PostMapping("/login")
    public SuccessResponse login( @Valid @RequestBody LoginRequestDTO dto) {
        return new SuccessResponse(authService.login(dto));
    }
}

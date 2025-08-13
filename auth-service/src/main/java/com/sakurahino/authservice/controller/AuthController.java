package com.sakurahino.authservice.controller;

import com.sakurahino.authservice.dto.LoginRequestDTO;
import com.sakurahino.authservice.dto.RegisterRequestDTO;
import com.sakurahino.authservice.dto.ResetPasswordDTO;
import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.authservice.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

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


    // Xử lý controller về mật khẩu
    @GetMapping("/{username}")
    public SuccessResponse getEmailByUsername(@PathVariable("username") String username) {
        return new SuccessResponse(authService.getEmailByUsername(username));
    }

    @PostMapping("/verify-code")
    public SuccessResponse verifyCode(@RequestBody @Valid ResetPasswordDTO.ForgotPasswordRequest dto){
        authService.sendResetCode(dto);
        return new SuccessResponse("Gửi mã code thành công");
    }

    @PostMapping("/check-code")
    public SuccessResponse checkCode(@RequestBody @Valid ResetPasswordDTO.VerifyCodeRequest dto) {
        var result = authService.checkCode(dto);
        return new SuccessResponse(result);

    }

    @PostMapping("/reset-password")
    public SuccessResponse resetPassword(@RequestBody @Valid ResetPasswordDTO.ResetPasswordRequest dto) {
            authService.resetPassword(dto);
            return new SuccessResponse("Đổi mật khẩu thành công");
    }
}

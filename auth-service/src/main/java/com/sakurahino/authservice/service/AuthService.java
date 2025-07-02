package com.sakurahino.authservice.service;

import com.sakurahino.authservice.dto.*;

public interface AuthService {

    void register(RegisterRequestDTO dto);

    LoginResponseDTO login(LoginRequestDTO dto);

    ForgotPasswordEmailResponse getEmailByUsername(String username);

    void sendResetCode(ResetPasswordDTO.ForgotPasswordRequest verifyCodeRequest);
    boolean checkCode(ResetPasswordDTO.VerifyCodeRequest verifyCodeRequest);
    void resetPassword(ResetPasswordDTO.ResetPasswordRequest dto);

}

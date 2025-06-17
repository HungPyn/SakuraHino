package com.sakurahino.authservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class ResetPasswordDTO {

    @Data
    public static class ForgotPasswordRequest {
        @NotBlank(message = "Username không được để trống")
        private String username;
    }

    @Data
    public static class VerifyCodeRequest {
        @NotBlank(message = "Username không được để trống")
        private String username;

        @NotBlank(message = "Mã xác nhận không được để trống")
        private String code;
    }

    @Data
    public static class ResetPasswordRequest {
        @NotBlank(message = "Mã code không được để trống")
        private String code;

        @NotBlank(message = "Mật khẩu mới không được để trống")
        private String newPassword;
    }
}

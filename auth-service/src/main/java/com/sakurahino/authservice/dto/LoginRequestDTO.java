package com.sakurahino.authservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDTO {
    @NotBlank(message = "Tài khoản không được trống")
    private String username;
    @NotBlank(message = "Mật khẩu không được trống")
    private String password;
}

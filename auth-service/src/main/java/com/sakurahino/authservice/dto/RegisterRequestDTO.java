package com.sakurahino.authservice.dto;

import com.sakurahino.clients.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.Instant;

@Data
public class RegisterRequestDTO {

    @NotBlank(message = "Họ tên không được để trống")
    @Size(min = 2, max = 50, message = "Họ tên phải từ 2 đến 50 ký tự")
    private String name;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Tài khoản không được để trống")
    private String username;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, max = 32, message = "Mật khẩu phải từ 6 đến 32 ký tự")
    private String password;

    private Instant dayCreation;

    @NotNull(message = "Vai trò không được để trống")
    private Role role;
}

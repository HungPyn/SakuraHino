package com.sakurahino.authservice.dto;

import com.sakurahino.clients.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequestDTO {

    @NotBlank(message = "Họ tên không được để trống")
    private String name;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Tài khoản không được để trống")
    @Pattern(regexp = "^\\S+$", message = "Tài khoản không được chứa khoảng trắng")
    private String username;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, max = 16, message = "Mật khẩu phải từ 6 đến 32 ký tự")
    private String password;

    private Role role = Role.USER;
}

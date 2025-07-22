package com.sakurahino.clients.rabitmqModel;

import com.sakurahino.clients.enums.Role;
import com.sakurahino.clients.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterSuccessDTO {
    private String id;
    private String name;
    private String email;
    private String username;
    private Role role;
    private Instant dayCreation;
    private UserStatus status;
}

package com.sakurahino.userservice.dto;

import com.sakurahino.clients.enums.Role;
import com.sakurahino.clients.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResponseUserDTO {

    private String id;

    private String name;

    private String email;

    private String username;

    private String avatarUrl;

    private ZonedDateTime dayCreation;

    private ZonedDateTime updatedDay;

    private Role role;

    private UserStatus status;

    private Boolean  online;
}

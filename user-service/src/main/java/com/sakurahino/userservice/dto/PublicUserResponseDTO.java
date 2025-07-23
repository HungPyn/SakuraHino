package com.sakurahino.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PublicUserResponseDTO {

    private String name;

    private String email;

    private String username;

    private String avatarUrl;
}

package com.sakurahino.userservice.dto;

import com.sakurahino.userservice.enums.UserType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckedResponseDTO {
    private Boolean isNewUser;

    private UserType userType;
}

package com.sakurahino.clients.rabitmqModel.user;

import com.sakurahino.clients.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDeletedDTO {
    private String userId;
    private UserStatus status;
}

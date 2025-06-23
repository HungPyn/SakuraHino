package com.sakurahino.toppicservice.security.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserContext {
    private String idUser;
    private String role;
}

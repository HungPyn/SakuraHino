package com.sakurahino.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserLongStreakDTO {

    private  String username;

    private String name;

    private Integer longStreak;

    private Long expScore;
}

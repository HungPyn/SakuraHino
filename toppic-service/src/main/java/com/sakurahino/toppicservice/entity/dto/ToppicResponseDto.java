package com.sakurahino.toppicservice.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ToppicResponseDto {

    private Integer id;


    private String topicName;

    private String avatarUrl;

    private Instant dayCreation;

    private Integer levelId;

}

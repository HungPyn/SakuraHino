package com.sakurahino.learningservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopicResponse {

    private UUID id;

    private String name;

    private String urlImage;

    private Instant createAt;

    private Integer levelId;
}

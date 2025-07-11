package com.sakurahino.learningservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TopicResponse {

    private Integer id;

    private String name;

    private String urlImage;

    private Instant createAt;

    private Boolean complete;
}

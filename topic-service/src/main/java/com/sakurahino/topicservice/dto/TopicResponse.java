package com.sakurahino.topicservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopicResponse {

    private Integer id;

    private String name;

    private String urlImage;

    private Instant createdAt;

    private LevelResponse level;
}

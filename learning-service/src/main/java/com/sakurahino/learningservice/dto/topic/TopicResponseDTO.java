package com.sakurahino.learningservice.dto.topic;

import com.sakurahino.learningservice.enums.LearningStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TopicResponseDTO {

    private Integer id;

    private String name;

    private String urlImage;

    private ZonedDateTime createAt;

    private ZonedDateTime updateAt;

    private Integer position;

    private int maxLesson;

    private String level;

    private LearningStatus status;

}

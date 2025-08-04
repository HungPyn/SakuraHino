package com.sakurahino.learningservice.dto.topic;

import com.sakurahino.learningservice.enums.LearningStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TopicResponseDTO {

    private Integer id;

    private String name;

    private String urlImage;

    private Instant createAt;

    private Instant updateAt;

    private Integer position;

    private int maxLesson;

    private String level;

    private LearningStatus status;

}

package com.sakurahino.learningservice.dto.lesson;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LessonResponseDTO {
    private Integer id;

    private String lessonName;

    private Integer maxQuestions;

    private int position;

    private Instant createdAt;

    private Instant updateAt;

    private Integer topicId;

    private String topicName;
}

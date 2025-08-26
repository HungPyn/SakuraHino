package com.sakurahino.learningservice.dto.lesson;

import com.sakurahino.learningservice.enums.LearningStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LessonResponseDTO {

    private Integer id;

    private String lessonName;

    private Integer maxQuestions;

    private int position;

    private ZonedDateTime createdAt;

    private ZonedDateTime updateAt;

    private Integer topicId;

    private String topicName;

    private LearningStatus status;
}

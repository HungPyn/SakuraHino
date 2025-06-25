package com.sakurahino.lessonservice.dto.lesson;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LessonResponseDto {
    private Integer id;
    private String lessonName;
    private Instant dayCreation;
    private Integer topicId;
    private boolean isComplete;

}

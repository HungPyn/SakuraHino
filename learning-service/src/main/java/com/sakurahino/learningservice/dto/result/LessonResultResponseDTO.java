package com.sakurahino.learningservice.dto.result;

import com.sakurahino.learningservice.enums.ResultStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LessonResultResponseDTO {
    private String userId;
    private String lessonCode;
    private Long score;
    private Integer totalQuestion;
    private Integer correctCount;
    private Integer wrongCount;
    private Long durationSeconds;
    private Instant completedAt;
    private ResultStatus status;
}

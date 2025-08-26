package com.sakurahino.learningservice.dto.result;

import com.sakurahino.learningservice.entity.Topic;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PracticeResultRequestDTO {

    private String userId;

    private String topicCode;

    private Long score;

    private Boolean status;

    private Integer totalQuestion;

    private Integer correctCount;

    private Integer wrongCount;

    private Long durationSeconds;
}

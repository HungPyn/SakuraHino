package com.example.resultservice.dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResultResponseDto {
    private Integer id;

    private Integer userId;

    private Integer toppicId;

    private Integer lessonId;

    private Instant startDatetime;

    private Instant endDatetime;

    private Integer studyTime;

    private Integer correctAnswers;

    private Integer totalQuestions;

    private BigDecimal scorePercent;

    private Boolean isComplete = false;
}

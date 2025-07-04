package com.example.resultservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResultResponseExamDto {
    private Integer id;

    private UUID userId;

    private Integer toppicId;

    private Instant startDatetime;

    private Instant endDatetime;

    private Integer studyTime;

    private Integer correctAnswers;

    private Integer totalQuestions;

    private BigDecimal scorePercent;

    private Boolean isComplete = false;
}

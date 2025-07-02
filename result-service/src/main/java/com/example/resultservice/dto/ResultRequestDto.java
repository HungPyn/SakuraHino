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
public class ResultRequestDto {

    @NotNull(message = "Không được để trống id user")
    private Integer userId;

    private Integer toppicId;

    private Integer lessonId;

    @NotNull
    private Instant startDatetime;

    @NotNull(message = "Không được để trống thời gian bắt đầu")
    @Column(name = "end_datetime", nullable = false)
    private Instant endDatetime;

    @NotNull(message = "Không được để trống thời gian làm bài")
    @Column(name = "study_time")
    private Integer studyTime;
    @NotNull(message = "Không được để trống câu đúng")
    @Column(name = "correct_answers")
    private Integer correctAnswers;

    @NotNull(message = "Không được để trống tổng số câu")
    private Integer totalQuestions;

    @NotNull(message = "Không được để trống phần trăm")
    private BigDecimal scorePercent;

    private Boolean isComplete = false;
}

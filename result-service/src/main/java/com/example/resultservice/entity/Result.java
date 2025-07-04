package com.example.resultservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "results")
public class Result {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id", nullable = false)
    private Integer id;

    @NotNull(message = "Không được để trống userid")
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "toppic_id")
    private Integer toppicId;

    @Column(name = "lesson_id")
    private Integer lessonId;

    @NotNull
    @Column(name = "start_datetime", nullable = false)
    private Instant startDatetime;

    @NotNull
    @Column(name = "end_datetime", nullable = false)
    private Instant endDatetime;

    @Column(name = "study_time")
    private Integer studyTime;

    @Column(name = "correct_answers")
    private Integer correctAnswers;

    @Column(name = "total_questions")
    private Integer totalQuestions;

    @Column(name = "score_percent", precision = 5, scale = 2)
    private BigDecimal scorePercent;

    @NotNull
    @Column(name = "isComplete", nullable = false)
    private Boolean isComplete = false;

}
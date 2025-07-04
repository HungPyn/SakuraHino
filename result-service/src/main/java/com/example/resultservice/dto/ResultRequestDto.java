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
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResultRequestDto {

    @NotNull(message = "Không được để trống id user")
    private UUID userId;

    private Integer toppicId;

    private Integer lessonId;

    @NotNull(message = "Không được để trống thời gian bắt đầu")
    private Instant startDatetime;

    @NotNull(message = "Không được để trống thời gian bắt đầu")
    private Instant endDatetime;

    @NotNull(message = "Không được để trống thời gian làm bài")

    private Integer studyTime;
    @NotNull(message = "Không được để trống câu đúng")

    private Integer correctAnswers;

    @NotNull(message = "Không được để trống tổng số câu")
    private Integer totalQuestions;

    @NotNull(message = "Không được để trống phần trăm")
    private BigDecimal scorePercent;

}

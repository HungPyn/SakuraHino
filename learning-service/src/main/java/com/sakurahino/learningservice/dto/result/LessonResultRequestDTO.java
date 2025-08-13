package com.sakurahino.learningservice.dto.result;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class LessonResultRequestDTO {

    @NotNull(message = "Bài học không được để trống")
    private String lessonCode;

    @Min(value = 0, message = "Điểm không được âm")
    private Long score;


    @Min(value = 0, message = "Tổng số câu hỏi không được âm")
    private Integer totalQuestion;

    @Min(value = 0, message = "Số câu đúng không được âm")
    private Integer correctCount;

    @Min(value = 0, message = "Số câu sai không được âm")
    private Integer wrongCount;

    @Min(value = 0, message = "Thời gian làm bài không được âm")
    private Long durationSeconds;
}


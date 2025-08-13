package com.sakurahino.learningservice.dto.topic;

import com.sakurahino.learningservice.enums.LearningStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TopicRequestDTO {

    @NotBlank(message = "Tên chủ đề không được trống")
    private String name;


    @NotNull(message = "Số bài học không được trống")
    @Min(value = 5, message = "Số bài học tối thiểu là 5")
    @Max(value = 8, message = "Số bài học tối đa là 8")
    private Integer maxLesson;


    @NotNull(message = "Trạng thái không được trống")
    private LearningStatus status;

    @NotNull(message = "Cấp độ không được trống")
    private Integer levelId;
}

package com.sakurahino.learningservice.dto.lesson;

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
public class LessonRequestDTO {

    @NotBlank(message = "Không được để trống tên lesson")
    private String lessonName;

    @NotNull(message = "Không được để trống topicId")
    private Integer topicId;

    @NotNull(message = "Trạng thái không được null")
    private LearningStatus status;

    @NotNull(message = "Số bài học không được trống")
    @Min(value = 10, message = "Số câu hỏi tối thiểu là 8")
    @Max(value = 15, message = "Số cẩu hỏi tối đa là 15")
    private Integer maxQuestions;


}

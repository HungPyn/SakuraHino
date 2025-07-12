package com.sakurahino.learningservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuestionChoiceRequest {
    private Integer id; // để trống id nếu thêm mới

    private Integer lessonId;
    private String textForeign;
    private String textRomaji;

    private MultipartFile imageFile;

    private String textAudioChoice;

    private Boolean isCorrect = false;

    private String textBlock;
    @NotBlank(message = "Nghĩa câu hỏi không được để trống")

    private String meaning;
}

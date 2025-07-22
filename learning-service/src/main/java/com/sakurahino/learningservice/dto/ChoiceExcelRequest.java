package com.sakurahino.learningservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChoiceExcelRequest {
    private Integer lessonQuestionId;
    private String textForeign;
    private String textRomaji;

    private String imageUrl;

    private String textAudioChoice;

    private Boolean isCorrect = false;

    private String textBlock;

    private String meaning;
}

package com.sakurahino.learningservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuestionExcelRequest {

    // private String questionType;
    @NotBlank(message = "Loại câu hỏi không được để trống")
    private String questionType;

    @NotBlank(message = "Nội dung câu hỏi không được để trống")
    private String promptTextTemplate;


    private String targetWordNative;


    private String targetLanguageCode;


    private String optionsLanguageCode;


    private String textAudioQuestion;

    private List<ChoiceExcelRequest> choiceRequests;
}

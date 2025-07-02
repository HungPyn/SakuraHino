package com.example.examservice.dto.exam;

import com.example.examservice.dto.choiceExam.QuestionChoiceRequestDto;
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

public class ExamQuestionRequestDto {

    @NotNull(message = "Không được để trống toppicId")
    private Integer toppicId;

    private String audioUrlQuestions;

    @NotBlank(message = "Không được để trống questionType")
    private String questionType;


    private String promptTextTemplate;


    private String targetWordNative;

    private String targetLanguageCode;

    private String optionsLanguageCode;

    private List<QuestionChoiceRequestDto> questionChoices;
}

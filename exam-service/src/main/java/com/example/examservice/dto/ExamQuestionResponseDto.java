package com.example.examservice.dto;

import com.example.examservice.entity.enums.QuestionType;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonPropertyOrder({
        "id",
        "toppicId",
        "audioUrlQuestions",
        "questionType",
        "promptTextTemplate",
        "targetWordNative",
        "targetLanguageCode",
        "optionsLanguageCode",
        "questionChoices"
})
public class ExamQuestionResponseDto {

    private Integer id;

    private Integer toppicId;

    private String audioUrlQuestions;

    private QuestionType questionType;


    private String promptTextTemplate;


    private String targetWordNative;


    private String targetLanguageCode;

    private String optionsLanguageCode;

    private List<QuestionChoiceResponseDto> questionChoices;
}

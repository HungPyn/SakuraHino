package com.sakurahino.learningservice.dto;

import com.sakurahino.learningservice.enums.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LessonQuestionRequest {

    private Integer topicId;

    private String questionType;

    private String promptTextTemplate;


    private String targetWordNative;


    private String targetLanguageCode;


    private String optionsLanguageCode;


    private String textUrlQuestion;

    private List<QuestionChoiceRequest> choiceRequests;
}

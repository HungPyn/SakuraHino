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
public class LessonQuestionResponse {

    private Integer id;

    private Integer lessonId;

    private QuestionType questionType;

    private String promptTextTemplate;


    private String targetWordNative;


    private String targetLanguageCode;


    private String optionsLanguageCode;


    private String audioUrlQuestions;

    private List<QuestionChoiceResponse> choices;
}

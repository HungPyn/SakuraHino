package com.sakurahino.learningservice.dto.question;

import com.sakurahino.learningservice.dto.questionchoice.QuestionChoiceResponse;
import com.sakurahino.learningservice.enums.LearningStatus;
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

    private LearningStatus status;

    private String promptTextTemplate;

    private String targetWordNative;

    private String targetLanguageCode;

    private String audioUrl;

    private List<QuestionChoiceResponse> choices;
}

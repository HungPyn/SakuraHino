package com.sakurahino.lessonservice.dto.LessonQuestionResponse;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.sakurahino.lessonservice.dto.questionChoice.QuestionChoiceResponseDto;
import com.sakurahino.lessonservice.entity.Lesson;
import com.sakurahino.lessonservice.entity.enums.QuestionType;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
        "lessonId",
        "audioUrlQuestions",
        "questionType",
        "promptTextTemplate",
        "targetWordNative",
        "targetLanguageCode",
        "optionsLanguageCode",
        "questionChoices"
})
public class LessonQuestionResponseDto {

    private Integer id;

    private Integer LessonId;

    private String audioUrlQuestions;

    private QuestionType questionType;


    private String promptTextTemplate;


    private String targetWordNative;


    private String targetLanguageCode;

    private String optionsLanguageCode;

    private List<QuestionChoiceResponseDto> questionChoices;
}

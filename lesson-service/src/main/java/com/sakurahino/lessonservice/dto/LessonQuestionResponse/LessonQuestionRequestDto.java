package com.sakurahino.lessonservice.dto.LessonQuestionResponse;


import com.sakurahino.lessonservice.dto.questionChoice.QuestionChoiceRequestDto;
import com.sakurahino.lessonservice.dto.questionChoice.QuestionChoiceResponseDto;
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
public class LessonQuestionRequestDto {

    @NotNull(message = "Không được để trống lessonId")
    private Integer LessonId;

    private String audioUrlQuestions;

    @NotBlank(message = "Không được để trống questionType")
    private String questionType;


    private String promptTextTemplate;


    private String targetWordNative;

    private String targetLanguageCode;

    private String optionsLanguageCode;

    private List<QuestionChoiceRequestDto> questionChoices;
}

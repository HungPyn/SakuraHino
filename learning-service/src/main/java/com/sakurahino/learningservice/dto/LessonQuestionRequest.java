package com.sakurahino.learningservice.dto;

import com.sakurahino.learningservice.enums.QuestionType;
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
public class LessonQuestionRequest {


    @NotNull(message = "Id chủ đề không được để trống")

    private Integer lessonId;

    // private String questionType;
    @NotBlank(message = "Loại câu hỏi không được để trống")

    private String questionType;

    @NotBlank(message = "Nội dung câu hỏi không được để trống")
    private String promptTextTemplate;


    private String targetWordNative;


    private String targetLanguageCode;


    private String optionsLanguageCode;


    private String textAudioQuestion;

    private List<QuestionChoiceRequest> choiceRequests;
}

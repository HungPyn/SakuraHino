package com.sakurahino.learningservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuestionChoiceResponse {
    private Integer id;
    private Integer lessonQuestionId;
    private String textForeign;
    private String textRomaji;

    private String imageUrl;

    private String audioUrlForeign;

    private Boolean isCorrect = false;

    private String textBlock;

    private String meaning;
}

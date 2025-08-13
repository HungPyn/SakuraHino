package com.sakurahino.learningservice.dto.questionchoice;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChoiceExcelRequest {
    private Integer lessonQuestionId;
    private String textForeign;
    private String textRomaji;

    private String imageUrl;

    private String textAudioChoice;

    private Boolean isCorrect = false;

    private String textBlock;

    private String meaning;
}

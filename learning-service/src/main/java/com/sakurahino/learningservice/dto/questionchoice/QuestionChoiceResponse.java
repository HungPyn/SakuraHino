package com.sakurahino.learningservice.dto.questionchoice;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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

    private Boolean isCorrect;

    private List<String> items;

    private String meaning;
}

package com.sakurahino.lessonservice.dto.questionChoice;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuestionChoiceResponseDto {

    private Integer id;

    private Integer lessonQuestionId;


    private String textForeign;

    private String textRomaji;

    private String imageUrl;


    private String audioUrlForeign;


    private Boolean isCorrect = false;

    @JdbcTypeCode(SqlTypes.JSON)
    private String textBlock;

    private String meaning;
}

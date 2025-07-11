package com.sakurahino.learningservice.dto;

import com.sakurahino.learningservice.entity.Topic;
import com.sakurahino.learningservice.enums.QuestionType;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LessonQuestionResponse {

    private Integer id;

    private Integer topicId;

    private QuestionType questionType;

    private String promptTextTemplate;


    private String targetWordNative;


    private String targetLanguageCode;


    private String optionsLanguageCode;


    private String audioUrlQuestions;

    private List<QuestionChoiceResponse> choices;
}

package com.example.examservice.entity;

import com.example.examservice.entity.enums.QuestionType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "exam_questions")
public class ExamQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id", nullable = false)
    private Integer id;

    @Column(name = "toppic_id")
    private Integer toppicId;

    @NotNull
    @Lob
    @Enumerated(EnumType.STRING)
    @Column(name = "question_type", nullable = false)
    private QuestionType questionType;

    @NotNull
    @Lob
    @Column(name = "prompt_text_template", nullable = false)
    private String promptTextTemplate;

    @NotNull
    @Lob
    @Column(name = "target_word_native", nullable = false)
    private String targetWordNative;

    @Size(max = 10)
    @NotNull
    @Column(name = "target_language_code", nullable = false, length = 10)
    private String targetLanguageCode;

    @Size(max = 10)
    @NotNull
    @Column(name = "options_language_code", nullable = false, length = 10)
    private String optionsLanguageCode;

    @Size(max = 255)
    @Column(name = "audio_url_questions")
    private String audioUrlQuestions;

}
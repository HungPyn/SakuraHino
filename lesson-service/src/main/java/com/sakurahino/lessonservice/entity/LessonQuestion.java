package com.sakurahino.lessonservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "lesson_questions")
public class LessonQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @NotNull
    @Lob
    @Column(name = "question_type", nullable = false)
    private String questionType;

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

}
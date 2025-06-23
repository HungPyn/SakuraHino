package com.sakurahino.lessonservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "question_choices")
public class QuestionChoice {
    @Id
    @Column(name = "choice_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "lesson_question_id")
    private LessonQuestion lessonQuestion;

    @Column(name = "exam_question_id")
    private Integer examQuestionId;

    @NotNull
    @Lob
    @Column(name = "text_foreign", nullable = false)
    private String textForeign;

    @Lob
    @Column(name = "text_romaji")
    private String textRomaji;

    @Size(max = 255)
    @Column(name = "image_url")
    private String imageUrl;

    @Size(max = 255)
    @Column(name = "audio_url_foreign")
    private String audioUrlForeign;

    @NotNull
    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect = false;

    @Size(max = 255)
    @NotNull
    @Column(name = "meaning", nullable = false)
    private String meaning;

}
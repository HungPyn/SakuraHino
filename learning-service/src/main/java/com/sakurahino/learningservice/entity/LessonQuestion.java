package com.sakurahino.learningservice.entity;

import com.sakurahino.learningservice.enums.LearningStatus;
import com.sakurahino.learningservice.enums.QuestionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lesson_questions")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LessonQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "question_type", nullable = false, length = 50)
    private QuestionType questionType;

    @NotNull
    @Lob // giữ lại vì có thể là text dài
    @Column(name = "prompt_text_template", nullable = false)
    private String promptTextTemplate;

    @NotNull
    @Column(name = "target_word_native", nullable = false, length = 255)
    private String targetWordNative;

    @NotNull
    @Size(max = 10)
    @Column(name = "target_language_code", nullable = false, length = 10)
    private String targetLanguageCode;


    @Size(max = 255)
    @Column(name = "audio_url")
    private String audioUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")

    private LearningStatus status;
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @OneToMany(mappedBy = "lessonQuestion",
            cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<QuestionChoice> choices = new ArrayList<>();
}

package com.sakurahino.learningservice.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "lesson_questions")
public class LessonQuestion {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "lesson_id", nullable = false)
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

    @Size(max = 255)
    @Column(name = "audio_url_questions")
    private String audioUrlQuestions;

    @OneToMany(mappedBy = "lessonQuestion", // "lessonQuestion" là tên trường trong QuestionChoice entity
            cascade = CascadeType.ALL,    // Áp dụng tất cả các thao tác (PERSIST, MERGE, REMOVE) cho choices
            orphanRemoval = true,         // Xóa choices khỏi DB nếu chúng bị gỡ khỏi danh sách này
            fetch = FetchType.LAZY)       // Chỉ tải choices khi truy cập
    private List<QuestionChoice> choices = new ArrayList<>(); // Khởi tạo để tránh NullPointerException

}
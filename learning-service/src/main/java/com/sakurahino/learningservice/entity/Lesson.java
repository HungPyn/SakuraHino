package com.sakurahino.learningservice.entity;

import com.sakurahino.learningservice.enums.LearningStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "lessons")
public class Lesson {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "lesson_name")
    private String lessonName;

    @Column(name = "create_at")
    private Instant createdAt;

    @Column(name = "position")
    private int position;

    @Column(name = "max_questions")
    private Integer maxQuestions;

    @Column(name = "update_at")
    private Instant updateAt;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private LearningStatus status;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @OneToMany(mappedBy = "lesson", fetch = FetchType.LAZY)
    private List<UserLessonStatus> userStatuses;

    @Column(name = "code")
    String code;

}
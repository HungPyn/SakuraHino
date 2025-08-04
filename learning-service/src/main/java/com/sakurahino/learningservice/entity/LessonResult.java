package com.sakurahino.learningservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "result_lesson")
public class LessonResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id")
    private String userId;

    @ManyToOne
    @Column(name = "lesson_id")
    private Lesson lesson;

    @Column(name = "score")
    private Long score;

    @Column(name = "status")
    private Boolean status;

    @Column(name = "total_question")
    private Integer totalQuestion;

    @Column(name = "correct_count")
    private Integer correctCount;

    @Column(name = "wrong_count")
    private Integer wrongCount;

    @Column(name = "start_time")
    private Instant startTime;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Transient
    public Long getLearningDurationInSeconds() {
        if (startTime != null && completedAt != null) {
            return completedAt.getEpochSecond() - startTime.getEpochSecond();
        }
        return null;
    }
}

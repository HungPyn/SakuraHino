package com.sakurahino.learningservice.entity;

import com.sakurahino.learningservice.enums.ResultStatus;
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
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @Column(name = "score")
    private Long score;

    @Column(name = "total_question")
    private Integer totalQuestion;

    @Column(name = "correct_count")
    private Integer correctCount;

    @Column(name = "wrong_count")
    private Integer wrongCount;

    @Column(name = "duration_seconds")
    private Long durationSeconds;

    @Column(name = "start_time")
    private Instant startTime;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ResultStatus status;

}

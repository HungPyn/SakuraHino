package com.sakurahino.JLPTservice.module.entity;

import com.sakurahino.JLPTservice.enums.QuestionStatusEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "jlpt_question")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class JLPTQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "question")
    private String question;

    @Column(name = "correct_answer")
    private String correctAnswer;

    @Column(name = "day_created")
    private Instant dayCreated;

    @Column(name = "modify_at")
    private Instant modifyAt;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private QuestionStatusEnum questionStatusEnum;

}

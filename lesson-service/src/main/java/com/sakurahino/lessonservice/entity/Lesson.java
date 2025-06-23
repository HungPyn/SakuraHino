package com.sakurahino.lessonservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "lessons")
public class Lesson {
    @Id
    @Column(name = "lesson_id", nullable = false)
    private Integer id;

    @Size(max = 255)
    @NotNull
    @Column(name = "lesson_name", nullable = false)
    private String lessonName;

    @Column(name = "day_creation")
    private Instant dayCreation;

    @Column(name = "topic_id")
    private Integer topicId;

}
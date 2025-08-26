package com.sakurahino.learningservice.entity;

import com.sakurahino.learningservice.enums.LearningStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZonedDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "topics")
public class Topic {
    @Id
    @Column(name = "topic_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Size(max = 255)
    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 255)
    @Column(name = "url_image")
    private String urlImage;

    @Column(name = "position")
    private int position;

    @Column(name = "max_lesson", nullable = false)
    private int maxLesson;

    @Column(name = "create_at")
    private ZonedDateTime createAt;

    @Column(name = "update_at")
    private ZonedDateTime updateAt;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private LearningStatus status;

    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Lesson> lessons;

    @OneToMany(mappedBy = "topic", fetch = FetchType.LAZY)
    private List<UserTopicStatus> userStatuses;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "level_id", nullable = false)
    private Level level;

    @Column(name = "code")
    private String code;

}
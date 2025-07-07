package com.sakurahino.learningservice.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "topics")
public class Topic {

    @Id
    @GeneratedValue
    @Column(name = "id", columnDefinition = "CHAR(36)")
    private UUID id;

    @Column(name = "topic_name")
    private String name;

    @Column(name = "url_image")
    private String urlImage;

    @Column(name = "create_at")
    private Instant createAt;

    @ManyToOne
    private Level level;
}

package com.sakurahino.topicservice.entity;


import jakarta.persistence.*;
import lombok.*;

import java.rmi.server.UID;
import java.time.Instant;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "topics")
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UID id;

    @Column(name = "topic_name")
    private String name;

    @Column(name = "url_image")
    private String urlImage;

    @Column(name = "create_at")
    private Instant createAt;

    @ManyToOne
    private Level level;
}

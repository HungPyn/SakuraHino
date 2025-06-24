package com.sakurahino.toppicservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "topics")
public class Toppic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // THÊM DÒNG NÀY
    @Column(name = "topic_id", nullable = false)
    private Integer id;

    @Size(max = 255)
    @NotNull
    @Column(name = "topic_name", nullable = false)
    private String topicName;

    @Size(max = 255)
    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "day_creation")
    private Instant dayCreation;

    @Column(name = "level_id")
    private Integer levelId;

}
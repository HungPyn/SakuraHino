package com.sakurahino.JLPTservice.module.entity;

import com.sakurahino.JLPTservice.enums.LevelEnums;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "jlpt")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JLPT {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "level")
    private LevelEnums level;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "createAt")
    private Instant createAt;

    @Column(name = "modifyAt")
    private Instant modifyAt;

    @Column(name = "status")
    private String status;
}

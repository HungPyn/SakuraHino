package com.sakurahino.JLPTservice.module.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.ZonedDateTime;

@Entity
@Table(name = "jlpt_user_status")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JLPTUserStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "score")
    private Integer score;

    @Column(name = "day_created")
    private ZonedDateTime dayCreated;

    @Column(name = "day_modified")
    private ZonedDateTime dayModified;
    @Column(name = "part_1")
    private Integer part1;

    @Column(name = "part_2")
    private Integer part2;

    @Column(name = "part_3")
    private Integer part3;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meta_data_id", referencedColumnName = "id")
    private JLPTMetaData metaData;

}

package com.sakurahino.JLPTservice.module.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.sakurahino.JLPTservice.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.List;

@Entity
@Table(name = "jlpt_meta_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JLPTMetaData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "exam_name")
    private String examName;

    @Column(name = "download_url")
    private String downloadUrl;

    @Column(name = "audio_url")
    private String audioUrl;

    @Column(name = "text_reading")
    private String textReading;

    @Column(name = "exam_time")
    private Integer examTime;

    @Column(name = "create_at")
    private ZonedDateTime createAt;

    @Column(name = "modify_at")
    private ZonedDateTime modifyAt;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusEnum status;

    @OneToMany(mappedBy = "metaData", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<JLPTUserStatus> userStatus;
}

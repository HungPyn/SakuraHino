package com.sakurahino.aphabetservice.module.entity;

import com.sakurahino.aphabetservice.enums.ProgressStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.time.ZonedDateTime;

@Entity
@Table(name = "alphabets_user_status")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlphabetsUserStatus {
    @Id
    @Column(name = "id",nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "complete_at")
    private ZonedDateTime completeAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "progress_status")
    private ProgressStatus progressStatus;

    @Column(name = "next_due_date")
    private ZonedDateTime nextDueDate;

    @Column(name = "repetition_interval")
    private Integer repetiton;

    @Column(name = "score")
    private Integer score;

    @NotNull
    @Column(name = "user_id", nullable = false)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alphabet_id")
    private Alphabet alphabet;
}

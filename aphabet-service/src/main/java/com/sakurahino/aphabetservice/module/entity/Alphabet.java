package com.sakurahino.aphabetservice.module.entity;

import com.sakurahino.aphabetservice.enums.AlphabetsStatus;
import com.sakurahino.aphabetservice.enums.CharacterType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity(name = "alphabets")
public class Alphabet {
    @Id
    @Column(name = "id",nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "japanese_character")
    private String japaneseCharacter;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "modify_at")
    private Instant modifyAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private AlphabetsStatus status;

    @Column(name = "position")
    private Integer position;

    @Enumerated(EnumType.STRING)
    @Column(name = "character_type")
    private CharacterType characterType;

    @OneToMany(mappedBy = "alphabet",fetch = FetchType.LAZY)
    private List<AlphabetsUserStatus> userStatuses;

}

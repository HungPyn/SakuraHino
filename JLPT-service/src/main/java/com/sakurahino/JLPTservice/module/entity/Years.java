package com.sakurahino.JLPTservice.module.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "years")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Years {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "year")
    private String year;
}

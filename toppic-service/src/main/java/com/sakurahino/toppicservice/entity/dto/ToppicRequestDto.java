package com.sakurahino.toppicservice.entity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ToppicRequestDto {
    private Integer id;
    @NotBlank(message = "Tên Toppic không được để trống")
    private String topicName;
    private Instant dayCreation;
    @NotNull(message = "Level ID không được để trống")
    private Integer levelId;
}

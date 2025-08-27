package com.sakurahino.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegistrationStatDto {
    private String period; // "2025-08-01" / "2025-W33" / "2025-08"
    private Long count;
}

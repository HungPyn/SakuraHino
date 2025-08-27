package com.sakurahino.JLPTservice.module.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JLPTMetaDataResponseDTO {
    private Long id;
    private String examName;
    private String downloadUrl;
    private String audioUrl;
    private Integer examTime;
    private String textReading;
    private String status;
}

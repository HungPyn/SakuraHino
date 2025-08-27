package com.sakurahino.JLPTservice.module.dto.response;

import com.sakurahino.JLPTservice.enums.StatusEnum;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GetByUserIdResponse {
    private Long id;
    private String examName;
    private Integer score;
    private Integer part1;
    private Integer part2;
    private Integer part3;
    private String downloadUrl;
    private String audioUrl;
    private Integer examTime;
    private StatusEnum status;
}

package com.sakurahino.JLPTservice.module.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateResultJLPTExamResponse {
    private String examName;
    private Integer score;
    private Integer part1;
    private Integer part2;
    private Integer part3;
}

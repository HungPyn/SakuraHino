package com.sakurahino.JLPTservice.module.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateResultJLPTExamRequest {
    private Long examId;
    private Integer part1;
    private Integer part2;
    private Integer part3;
    private Integer score;
}

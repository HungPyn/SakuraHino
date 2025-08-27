package com.sakurahino.JLPTservice.module.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BaseResponseDTO<T> {
    private String statusCode;
    private String errorMessage;
    private T Data;
}

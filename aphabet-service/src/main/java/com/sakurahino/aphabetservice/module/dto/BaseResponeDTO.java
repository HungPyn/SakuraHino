package com.sakurahino.aphabetservice.module.dto;

import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
public class BaseResponeDTO<T> {
    private String statusCode;
    private String errorMessage;
    private T Data;
}

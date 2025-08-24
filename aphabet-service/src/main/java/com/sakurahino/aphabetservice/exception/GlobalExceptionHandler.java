package com.sakurahino.aphabetservice.exception;

import com.sakurahino.aphabetservice.module.dto.BaseResponeDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<BaseResponeDTO<?>> handleBadRequest(IllegalArgumentException ex) {
        BaseResponeDTO<?> response = BaseResponeDTO.builder()
                .statusCode("400")
                .errorMessage(ex.getMessage())
                .Data(null)
                .build();
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponeDTO<Object>> handleInternalError(Exception ex) {
        BaseResponeDTO<Object> response = BaseResponeDTO.builder()
                .statusCode("500")
                .errorMessage("Internal server error")
                .Data(null)
                .build();
        return ResponseEntity.status(500).body(response);
    }
}


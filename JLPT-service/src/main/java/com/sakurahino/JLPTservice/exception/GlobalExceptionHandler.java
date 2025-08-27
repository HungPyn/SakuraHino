package com.sakurahino.JLPTservice.exception;

import com.sakurahino.JLPTservice.module.dto.BaseResponseDTO;
import jakarta.ws.rs.NotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<BaseResponseDTO<?>> handleBadRequest(IllegalArgumentException ex) {
        BaseResponseDTO<?> response = BaseResponseDTO.builder()
                .statusCode("400")
                .errorMessage(ex.getMessage())
                .Data(null)
                .build();
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponseDTO<Object>> handleInternalError(Exception ex) {
        BaseResponseDTO<Object> response = BaseResponseDTO.builder()
                .statusCode("500")
                .errorMessage("Internal server error")
                .Data(null)
                .build();
        return ResponseEntity.status(500).body(response);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<BaseResponseDTO<?>> handleNotFound(NotFoundException ex) {
        BaseResponseDTO<?> response = BaseResponseDTO.builder()
                .statusCode("404")
                .errorMessage(ex.getMessage())
                .Data(null)
                .build();
        return ResponseEntity.badRequest().body(response);
    }
}


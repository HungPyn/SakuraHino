package com.sakurahino.common.retresponse;

import com.sakurahino.common.ex.ResourceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.MethodArgumentNotValidException;

@Slf4j
public abstract class BaseExceptionHandler {

    public ApiResponse handleResourceException(ResourceException e) {
        log.error("Lỗi nghiệp vụ: {}", e.getMessage());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new ApiResponse(e.getStatus(), e.getError(), headers);
    }

    public ErrorResponse handleValidationError(MethodArgumentNotValidException e) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new ErrorResponse(e.getBindingResult().getFieldErrors(), headers);
    }

    public ApiResponse handleAllException(Exception e) {
        log.error("Lỗi không xác định: {}", e.getMessage(), e);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new ApiResponse(500, "Lỗi hệ thống. Vui lòng thử lại sau.", headers);
    }


}

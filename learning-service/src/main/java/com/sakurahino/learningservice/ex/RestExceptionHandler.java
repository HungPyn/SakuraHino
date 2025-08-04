package com.sakurahino.learningservice.ex;

import com.sakurahino.common.ex.ResourceException;
import com.sakurahino.common.retresponse.ApiResponse;
import com.sakurahino.common.retresponse.BaseExceptionHandler;
import com.sakurahino.common.retresponse.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class RestExceptionHandler extends BaseExceptionHandler {

    @ExceptionHandler(ResourceException.class)
    public ApiResponse handleResource(ResourceException e) {
        return super.handleResourceException(e);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ErrorResponse handleValidation(MethodArgumentNotValidException e) {
        return super.handleValidationError(e);
    }

    @ExceptionHandler(Exception.class)
    public ApiResponse handleOther(Exception e) {
        return super.handleAllException(e);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ApiResponse handleInvalidEnum(HttpMessageNotReadableException e) {
        log.error("Lỗi parse dữ liệu: {}", e.getMessage());
        return new ApiResponse(400, "Dữ liệu không hợp lệ hoặc không thể đọc. Vui lòng kiểm tra giá trị các trường.", null);
    }
}

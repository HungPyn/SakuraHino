package com.sakurahino.uploadservice.exception;

import com.sakurahino.common.ex.ResourceException;
import com.sakurahino.common.retresponse.ApiResponse;
import com.sakurahino.common.retresponse.BaseExceptionHandler;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class RestExceptionHandler extends BaseExceptionHandler {

    @ExceptionHandler(ResourceException.class)
    public ApiResponse handleResource(ResourceException e) {
        return super.handleResourceException(e);
    }

    @ExceptionHandler(Exception.class)
    public ApiResponse handleAll(Exception e) {
        return super.handleAllException(e);
    }
}



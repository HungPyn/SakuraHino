package com.sakurahino.authservice.retresponse;

import org.springframework.http.HttpStatus;

public class SuccessResponse extends ApiResponse{
    public SuccessResponse() {
        super(HttpStatus.OK);
    }

    public SuccessResponse(Object data) {
        super(HttpStatus.OK, data);
    }
}

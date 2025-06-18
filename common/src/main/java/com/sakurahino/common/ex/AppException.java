package com.sakurahino.common.ex;


public class AppException extends ResourceException {

    public AppException(ExceptionCode code) {
        super(code.getStatus(), code.getError());
    }

    public AppException(ExceptionCode code, Object... args) {
        super(code.getStatus(), String.format(code.getError(), args));
    }
}

package com.sakurahino.clients.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Role {
    ADMIN,
    USER;

    @JsonCreator
    public static Role from(String value) {
        if (value==null || value.isBlank()) {
            return null;
        };
        try{
            return Role.valueOf(value.toUpperCase());
        }catch (IllegalArgumentException e){
            throw  new IllegalArgumentException("Vai trò không hợp lệ" + value);
        }
    }
}

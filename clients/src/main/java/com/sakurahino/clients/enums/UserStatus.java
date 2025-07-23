package com.sakurahino.clients.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum  UserStatus {
    ACTIVE,
    BLOCKED,
    DELETED;

    @JsonCreator
    public static UserStatus from(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return UserStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ: " + value);
        }
    }
}

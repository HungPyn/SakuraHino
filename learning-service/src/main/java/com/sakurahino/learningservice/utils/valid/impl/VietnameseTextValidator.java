package com.sakurahino.learningservice.utils.valid.impl;

import com.sakurahino.learningservice.utils.valid.VietnameseText;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class VietnameseTextValidator implements ConstraintValidator<VietnameseText, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return false; // hoặc return true nếu đã dùng @NotBlank
        }
        // Cho phép chữ (bao gồm chữ có dấu tiếng Việt), số, khoảng trắng, và dấu câu cơ bản
        return value.matches("^[\\p{L}\\p{M}0-9\\s.,;:!?()\"'\\-]+$");
    }
}
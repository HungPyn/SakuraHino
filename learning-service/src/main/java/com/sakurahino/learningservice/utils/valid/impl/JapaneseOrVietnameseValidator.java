package com.sakurahino.learningservice.utils.valid.impl;

import com.sakurahino.learningservice.utils.valid.JapaneseOrVietnameseText;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class JapaneseOrVietnameseValidator implements ConstraintValidator<JapaneseOrVietnameseText, String> {

    private final JapaneseTextValidator japaneseValidator = new JapaneseTextValidator();
    private final VietnameseTextValidator vietnameseValidator = new VietnameseTextValidator();

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return false; // Hoặc true nếu đã có @NotBlank xử lý
        }
        // Tái sử dụng 2 validator cũ
        return japaneseValidator.isValid(value, context) || vietnameseValidator.isValid(value, context);
    }
}

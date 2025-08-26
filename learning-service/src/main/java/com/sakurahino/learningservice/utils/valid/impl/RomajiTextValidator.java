package com.sakurahino.learningservice.utils.valid.impl;

import com.sakurahino.learningservice.utils.valid.RomajiText;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class RomajiTextValidator implements ConstraintValidator<RomajiText, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) return false;
        // Chỉ cho phép chữ Latin, dấu cách, dấu '-'
        return value.matches("^[\\p{IsLatin}\\- ]+$");
    }
}

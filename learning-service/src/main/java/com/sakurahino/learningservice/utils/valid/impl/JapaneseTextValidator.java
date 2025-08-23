package com.sakurahino.learningservice.utils.valid.impl;

import com.sakurahino.learningservice.utils.valid.JapaneseText;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class JapaneseTextValidator implements ConstraintValidator<JapaneseText, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) return false;
        // Chỉ cho phép Kanji, Hiragana, Katakana và dấu kéo dài Katakana (ー)
        return value.matches("^[\\p{IsHan}\\p{IsHiragana}\\p{IsKatakana}ー0-9\\s]+$");
    }
}
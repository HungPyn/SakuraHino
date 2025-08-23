package com.sakurahino.learningservice.utils.valid;

import com.sakurahino.learningservice.utils.valid.impl.JapaneseTextValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = JapaneseTextValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface JapaneseText {
    String message() default "Chỉ được nhập ký tự tiếng Nhật (Kanji, Hiragana, Katakana)";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

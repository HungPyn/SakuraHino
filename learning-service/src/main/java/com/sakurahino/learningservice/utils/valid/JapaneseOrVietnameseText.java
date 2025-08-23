package com.sakurahino.learningservice.utils.valid;

import com.sakurahino.learningservice.utils.valid.impl.JapaneseOrVietnameseValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = JapaneseOrVietnameseValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface JapaneseOrVietnameseText {
    String message() default "Phải là tiếng Nhật hoặc tiếng Việt";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

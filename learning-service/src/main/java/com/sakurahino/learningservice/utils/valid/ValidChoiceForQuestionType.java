package com.sakurahino.learningservice.utils.valid;

import com.sakurahino.learningservice.utils.valid.impl.GenericQuestionValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = GenericQuestionValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidChoiceForQuestionType {
    String message() default "Lựa chọn không hợp lệ cho kiểu câu hỏi";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

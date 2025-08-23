package com.sakurahino.learningservice.utils.valid;

import com.sakurahino.learningservice.utils.valid.impl.RomajiTextValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = RomajiTextValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface RomajiText {
    String message() default "Phiên âm chỉ được nhập chữ Latin, dấu '-' và khoảng trắng";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

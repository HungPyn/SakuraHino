package com.sakurahino.learningservice.utils.valid;

import com.sakurahino.learningservice.utils.valid.impl.VietnameseTextValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = VietnameseTextValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface VietnameseText {
    String message() default "Nghĩa tiếng Việt không hợp lệ";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

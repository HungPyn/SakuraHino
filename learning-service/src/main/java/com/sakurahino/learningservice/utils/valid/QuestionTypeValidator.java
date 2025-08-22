package com.sakurahino.learningservice.utils.valid;

import com.sakurahino.learningservice.dto.question.LessonQuestionRequest;
import com.sakurahino.learningservice.enums.QuestionType;
import jakarta.validation.ConstraintValidatorContext;

public interface QuestionTypeValidator {

    boolean supports(QuestionType type);
    boolean isValid(LessonQuestionRequest dto, ConstraintValidatorContext context);
}

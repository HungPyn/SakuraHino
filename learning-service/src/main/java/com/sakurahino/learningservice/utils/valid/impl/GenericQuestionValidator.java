package com.sakurahino.learningservice.utils.valid.impl;

import com.sakurahino.learningservice.dto.question.LessonQuestionRequest;
import com.sakurahino.learningservice.utils.valid.QuestionTypeValidator;
import com.sakurahino.learningservice.utils.valid.ValidChoiceForQuestionType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
public class GenericQuestionValidator implements ConstraintValidator<ValidChoiceForQuestionType, LessonQuestionRequest> {

    private final List<QuestionTypeValidator> validators = List.of(
            new MultipleChoiceVocabImageValidator()
            // có thể thêm validator khác sau này
    );

    @Override
    public boolean isValid(LessonQuestionRequest question, ConstraintValidatorContext context) {
        if (question == null || question.getQuestionType() == null) return true;

        for (QuestionTypeValidator validator : validators) {
            if (validator.supports(question.getQuestionType())) {
                if (!validator.isValid(question, context)) {
                    return false; // dừng ngay nếu 1 validator fail
                }
            }
        }
        return true;
    }
}


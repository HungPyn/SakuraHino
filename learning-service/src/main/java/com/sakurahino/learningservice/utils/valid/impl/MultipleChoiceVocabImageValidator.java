package com.sakurahino.learningservice.utils.valid.impl;

import com.sakurahino.learningservice.dto.question.LessonQuestionRequest;
import com.sakurahino.learningservice.dto.questionchoice.QuestionChoiceRequest;
import com.sakurahino.learningservice.enums.QuestionType;
import com.sakurahino.learningservice.utils.valid.QuestionTypeValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.List;

public class MultipleChoiceVocabImageValidator implements QuestionTypeValidator {

    @Override
    public boolean supports(QuestionType type) {
        return type == QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE
                || type == QuestionType.MULTIPLE_CHOICE_TEXT_ONLY
                || type == QuestionType.AUDIO_CHOICE; // sửa lại ==
    }

    @Override
    public boolean isValid(LessonQuestionRequest question, ConstraintValidatorContext context) {
        if (question == null || question.getQuestionType() == null) return true;
        if (!supports(question.getQuestionType())) return true;

        List<QuestionChoiceRequest> choices = question.getChoiceRequests();
        context.disableDefaultConstraintViolation();

        // Check 4 choices
        if (choices == null || choices.size() != 4) {
            context.buildConstraintViolationWithTemplate("Câu hỏi phải có đúng 4 lựa chọn")
                    .addPropertyNode("choiceRequests")
                    .addConstraintViolation();
            return false;
        }

        // Check 1 correct answer
        long correctCount = choices.stream().filter(QuestionChoiceRequest::getIsCorrect).count();
        if (correctCount != 1) {
            context.buildConstraintViolationWithTemplate("Phải có đúng 1 đáp án đúng")
                    .addPropertyNode("choiceRequests")
                    .addConstraintViolation();
            return false;
        }

        // Check images for MULTIPLE_CHOICE_VOCAB_IMAGE
        if (question.getQuestionType() == QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE) {
            boolean allHaveImage = choices.stream()
                    .allMatch(c -> c.getImageKey() != null && !c.getImageKey().isBlank());
            if (!allHaveImage) {
                context.buildConstraintViolationWithTemplate("Mỗi lựa chọn phải có hình ảnh minh họa")
                        .addPropertyNode("choiceRequests")
                        .addConstraintViolation();
                return false;
            }
        }

        return true;
    }
}

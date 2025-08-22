//package com.sakurahino.learningservice.utils.valid.impl;
//
//import com.sakurahino.learningservice.dto.question.LessonQuestionRequest;
//import com.sakurahino.learningservice.enums.QuestionType;
//import com.sakurahino.learningservice.utils.valid.QuestionTypeValidator;
//import jakarta.validation.ConstraintValidatorContext;
//
//public class AudioRequiredValidator implements QuestionTypeValidator {
//
//    @Override
//    public boolean supports(QuestionType type) {
//        return QuestionType.AUDIO_CHOICE.equals(type)
//                || QuestionType.PRONUNCIATION.equals(type);
//    }
//
//    @Override
//    public boolean isValid(LessonQuestionRequest question, ConstraintValidatorContext context) {
//        if (question == null) return true;
//
//        if (supports(question.getQuestionType())) {
//            if (question.get() == null || question.getAudioUrl().isBlank()) {
//                context.disableDefaultConstraintViolation();
//                context.buildConstraintViolationWithTemplate(
//                                "Câu hỏi loại " + question.getQuestionType() + " bắt buộc phải có audio"
//                        )
//                        .addPropertyNode("audioUrl")
//                        .addConstraintViolation();
//                return false;
//            }
//        }
//
//        return true;
//    }
//}

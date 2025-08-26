package com.sakurahino.learningservice.utils.valid;
import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.learningservice.dto.question.LessonQuestionRequest;
import com.sakurahino.learningservice.dto.questionchoice.QuestionChoiceRequest;
import com.sakurahino.learningservice.entity.Lesson;

import com.sakurahino.learningservice.enums.LearningStatus;
import com.sakurahino.learningservice.enums.QuestionType;
import com.sakurahino.learningservice.repository.LessonQuestionRepository;
import com.sakurahino.learningservice.repository.LessonRepository;
import com.sakurahino.learningservice.utils.language.LanguageUtil;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
public class LessonQuestionValidator {

    public static void validate(LessonQuestionRequest data,
                                Map<String, MultipartFile> imageFilesMap,
                                LessonRepository lessonRepository,
                                LessonQuestionRepository lessonQuestionRepository,
                                Integer existingQuestionId) {
        // 1. Kiểm tra Lesson tồn tại
        Lesson lesson = lessonRepository.findById(data.getLessonId())
                .orElseThrow(() -> new AppException(ExceptionCode.LESSON_KHONG_TON_TAI));

        // 2. Check số lượng câu hỏi đã published
        int publishedCount = lessonQuestionRepository.countQuestions(lesson.getId(), LearningStatus.PUBLISHED);
        if (data.getStatus() == LearningStatus.PUBLISHED
                && (existingQuestionId == null && publishedCount >= lesson.getMaxQuestions())) {
            throw new AppException(ExceptionCode.MAX_PUBLIC_QUESTION_REACHED);
        }

        // 3. Check duplicate question
        boolean questionExists = (existingQuestionId == null) ?
                lessonQuestionRepository.existsByLessonIdAndTargetWordNativeIgnoreCaseAndQuestionType(
                        data.getLessonId(),
                        ValidUtils.normalizeForCompare(data.getTargetWordNative()),
                        data.getQuestionType()
                ) :
                lessonQuestionRepository.existsByLessonIdAndTargetWordNativeIgnoreCaseAndQuestionTypeAndIdNot(
                        data.getLessonId(),
                        ValidUtils.normalizeForCompare(data.getTargetWordNative()),
                        data.getQuestionType(),
                        existingQuestionId
                );
        if (questionExists) {
            throw new AppException(ExceptionCode.QUESTION_ALREADY_EXISTS);
        }

        // 4. Validate choiceRequests
        validateChoices(data);
        if (data.getQuestionType()== QuestionType.AUDIO_CHOICE || data.getQuestionType()==QuestionType.PRONUNCIATION ||data.getQuestionType()==QuestionType.WRITING ){
            if (!LanguageUtil.isJapanese(data.getTargetWordNative())){
                throw new AppException(ExceptionCode.DAP_AN_IS_JAPANESE);
            }
        }
        // 5. Validate image choice nếu là MULTIPLE_CHOICE_VOCAB_IMAGE
        if (data.getQuestionType() == QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE) {
            if (imageFilesMap == null || imageFilesMap.size() < 4) {
                throw new AppException(ExceptionCode.IMAGE_CHOICE_MUST_HAVE_4);
            }
        }
    }

    private static void validateChoices(LessonQuestionRequest data) {
        if (data.getChoiceRequests() != null && !data.getChoiceRequests().isEmpty()) {
            // 1. Check duplicate trong choiceRequests
            Set<String> seen = new HashSet<>();
            for (QuestionChoiceRequest cr : data.getChoiceRequests()) {
                String key = cr.getTextForeign() + "||" + cr.getMeaning();
                if (!seen.add(key)) {
                    throw new AppException(ExceptionCode.DUPLICATE_CHOICE_IN_REQUEST);
                }
            }

            // 2. Check đáp án đúng khớp targetWordNative
            for (QuestionChoiceRequest cr : data.getChoiceRequests()) {
                if (Boolean.TRUE.equals(cr.getIsCorrect())) {
                    if (LanguageUtil.isJapanese(data.getTargetWordNative())) {
                        if (!ValidUtils.normalizeForCompare(cr.getTextForeign())
                                .equals(ValidUtils.normalizeForCompare(data.getTargetWordNative()))) {
                            throw new AppException(ExceptionCode.CORRECT_ANSWER_NOT_MATCH_TARGET);
                        }
                    } else if (LanguageUtil.isVietnamese(data.getTargetWordNative())) {
                        if (!ValidUtils.normalizeForCompare(cr.getMeaning())
                                .equals(ValidUtils.normalizeForCompare(data.getTargetWordNative()))) {
                            throw new AppException(ExceptionCode.CORRECT_ANSWER_NOT_MATCH_TARGET);
                        }
                    }
                }
            }
        }
    }
}

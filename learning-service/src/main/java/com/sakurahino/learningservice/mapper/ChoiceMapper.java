package com.sakurahino.learningservice.mapper;

import com.sakurahino.learningservice.dto.LessonQuestionResponse;
import com.sakurahino.learningservice.dto.QuestionChoiceResponse;
import com.sakurahino.learningservice.entity.LessonQuestion;
import com.sakurahino.learningservice.entity.QuestionChoice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ChoiceMapper {
    @Mapping(source = "lessonQuestion.id", target = "lessonId")
    QuestionChoiceResponse mapChoiceResponse(QuestionChoice questionChoice);
}

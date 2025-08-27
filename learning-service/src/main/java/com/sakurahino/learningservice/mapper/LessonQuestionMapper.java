package com.sakurahino.learningservice.mapper;

import com.sakurahino.learningservice.dto.question.LessonQuestionRequest;
import com.sakurahino.learningservice.dto.question.LessonQuestionResponse;
import com.sakurahino.learningservice.entity.LessonQuestion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.web.bind.annotation.PostMapping;

@Mapper(componentModel = "spring")
public interface LessonQuestionMapper {

    @Mapping(source = "lesson.id", target = "lessonId")
    @Mapping(source = "audioUrl",target = "audioUrl")
    @Mapping(source = "choices", target = "choices")
    LessonQuestionResponse mapQuestionResponse(LessonQuestion lessonQuestion);

    LessonQuestion mapEntityFromeRequest(LessonQuestionRequest lessonQuestionRequest);

}

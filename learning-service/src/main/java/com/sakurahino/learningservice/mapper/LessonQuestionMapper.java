package com.sakurahino.learningservice.mapper;

import com.sakurahino.learningservice.dto.LessonQuestionRequest;
import com.sakurahino.learningservice.dto.LessonQuestionResponse;
import com.sakurahino.learningservice.entity.LessonQuestion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LessonQuestionMapper {
    @Mapping(source = "topic.id", target = "topicId")
    LessonQuestionResponse mapQuestionResponse(LessonQuestion lessonQuestion);

    LessonQuestion mapEntityFromeRequest(LessonQuestionRequest lessonQuestionRequest);

}

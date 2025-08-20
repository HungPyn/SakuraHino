package com.sakurahino.learningservice.mapper;

import com.sakurahino.learningservice.dto.lesson.LessonResponseDTO;
import com.sakurahino.learningservice.entity.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LessonMapper {
    @Mapping(source = "topic.id", target = "topicId")
    @Mapping(source = "topic.name",target = "topicName")
    @Mapping(source = "status", target = "status")
    LessonResponseDTO mapToLessonResponse(Lesson lesson);
    List<LessonResponseDTO> mapLessonListToResponseList(List<Lesson> lessons);

}

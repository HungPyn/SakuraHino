package com.sakurahino.learningservice.mapper;

import com.sakurahino.learningservice.dto.LessonRequest;
import com.sakurahino.learningservice.dto.LessonResponse;
import com.sakurahino.learningservice.dto.TopicResponse;
import com.sakurahino.learningservice.entity.Lesson;
import com.sakurahino.learningservice.entity.Topic;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LessonMapper {
    @Mapping(source = "topic.id", target = "topicId")
    LessonResponse maptoLessonResponse(Lesson lesson);
    List<LessonResponse> mapLessonListToResponseList(List<Lesson> lessons);
}

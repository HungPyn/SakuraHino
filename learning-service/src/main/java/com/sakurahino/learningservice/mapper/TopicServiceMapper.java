package com.sakurahino.learningservice.mapper;

import com.sakurahino.learningservice.dto.TopicResponse;
import com.sakurahino.learningservice.entity.Topic;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TopicServiceMapper {

    @Mapping(source = "level.id", target = "levelId")
    TopicResponse maptoTopicResponse(Topic topic);

}

package com.sakurahino.learningservice.mapper;

import com.sakurahino.learningservice.dto.topic.TopicResponseDTO;
import com.sakurahino.learningservice.entity.Topic;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TopicServiceMapper {

    @Mapping(source = "level.name",target = "level")
    TopicResponseDTO mapToTopicResponse(Topic topic);

}

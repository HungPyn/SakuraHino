package com.sakurahino.topicservice.mapper;

import com.sakurahino.topicservice.dto.TopicResponse;
import com.sakurahino.topicservice.entity.Topic;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TopicServiceMapper {

    TopicResponse maptoTopicResponse(Topic topic);
}

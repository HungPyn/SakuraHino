package com.sakurahino.learningservice.mapper;

import com.sakurahino.learningservice.dto.TopicResponse;
import com.sakurahino.learningservice.entity.Topic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TopicServiceMapper {

    TopicResponse maptoTopicResponse(Topic topic);

}

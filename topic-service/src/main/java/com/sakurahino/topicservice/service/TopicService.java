package com.sakurahino.topicservice.service;

import com.sakurahino.topicservice.dto.TopicRequest;
import com.sakurahino.topicservice.dto.TopicResponse;
import com.sakurahino.topicservice.entity.Topic;

import java.util.List;

public interface TopicService {

    List<TopicResponse> getAll(Integer levelId, String role);

    TopicResponse create(TopicRequest dto);
    TopicResponse update(TopicRequest dto);

    void delete(Integer id);
}

package com.sakurahino.topicservice.service;

import com.sakurahino.common.dto.PaginatedResponse;
import com.sakurahino.topicservice.dto.TopicRequest;
import com.sakurahino.topicservice.dto.TopicResponse;
import com.sakurahino.topicservice.entity.Topic;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TopicService {

    PaginatedResponse<TopicResponse> getAllForUser(Integer levelId, int page, int size);
    PaginatedResponse<TopicResponse> getAllForAdmin(Integer levelId,int page, int size);

    TopicResponse create(TopicRequest dto, MultipartFile file);
    TopicResponse update(String id,TopicRequest dto,MultipartFile file);
    TopicResponse getById(String id);
    void delete(String id);
}

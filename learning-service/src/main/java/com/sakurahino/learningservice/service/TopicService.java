package com.sakurahino.learningservice.service;

import com.sakurahino.common.dto.PaginatedResponse;
import com.sakurahino.learningservice.dto.TopicRequest;
import com.sakurahino.learningservice.dto.TopicResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface TopicService {

    PaginatedResponse<TopicResponse> getAllForUser(Integer levelId, int page, int size);
    PaginatedResponse<TopicResponse> getAllForAdmin(Integer levelId,int page, int size);

    TopicResponse create(TopicRequest dto, MultipartFile file);
    TopicResponse update(UUID id, TopicRequest dto, MultipartFile file);
    TopicResponse getById(UUID id);
    void delete(UUID id);
}

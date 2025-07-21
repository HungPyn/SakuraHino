package com.sakurahino.learningservice.service;

import com.sakurahino.common.dto.PaginatedResponse;
import com.sakurahino.learningservice.dto.TopicRequest;
import com.sakurahino.learningservice.dto.TopicResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface TopicService {

    PaginatedResponse<TopicResponse> getAllForUser( int page, int size, String userId);
    PaginatedResponse<TopicResponse> getAllForAdmin(int page, int size);

    TopicResponse create(TopicRequest dto, MultipartFile file);
    TopicResponse update(Integer id, TopicRequest dto, MultipartFile file);
    TopicResponse getById(Integer id);
    void delete(Integer id);
}

package com.sakurahino.learningservice.service;

import com.sakurahino.common.dto.PaginatedResponse;
import com.sakurahino.learningservice.dto.topic.StatusResponseDTO;
import com.sakurahino.learningservice.dto.topic.TopicRequestDTO;
import com.sakurahino.learningservice.dto.topic.TopicResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;

public interface TopicService {
    //admin
    PaginatedResponse<TopicResponseDTO> getAllForAdmin(int page, int size);
    TopicResponseDTO create(TopicRequestDTO dto, MultipartFile file);
    TopicResponseDTO update(Integer id, TopicRequestDTO dto, MultipartFile file);
    TopicResponseDTO getById(Integer id);
    List<StatusResponseDTO> getStatus();
    PaginatedResponse<TopicResponseDTO> findByFilters
            (int page, int size, String tuKhoa, Integer level, Instant startDdate, Instant endDate, String status);

    void delete(Integer id);
}

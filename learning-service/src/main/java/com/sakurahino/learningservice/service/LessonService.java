package com.sakurahino.learningservice.service;

import com.sakurahino.common.dto.PaginatedResponse;
import com.sakurahino.learningservice.dto.lesson.LessonRequestDTO;
import com.sakurahino.learningservice.dto.lesson.LessonResponseDTO;

import java.time.Instant;

public interface LessonService {
    PaginatedResponse<LessonResponseDTO> getLessonByTopicIdAdmin(Integer topicId, int page, int size);
    PaginatedResponse<LessonResponseDTO> findByFilters
            (String tuKhoa, Integer topicId, String status, Instant startDate, Instant endDate, int page, int size);
    LessonResponseDTO getLessonById(Integer id);
    LessonResponseDTO create(LessonRequestDTO lessonRequest);

    LessonResponseDTO update(Integer id, LessonRequestDTO lessonRequest);

    void delete(Integer id);


}

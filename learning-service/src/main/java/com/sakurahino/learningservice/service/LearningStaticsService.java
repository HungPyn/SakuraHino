package com.sakurahino.learningservice.service;

import com.sakurahino.learningservice.dto.result.ResponseStatsResultDTO;
import com.sakurahino.learningservice.dto.statics.RegistrationStatDto;
import com.sakurahino.learningservice.dto.statics.TotalLessonResponseDTO;

import java.time.ZonedDateTime;
import java.util.List;

public interface LearningStaticsService {

    TotalLessonResponseDTO getTotalLessonStatics();

    TotalLessonResponseDTO getTotalLessonByStatus();
    List<RegistrationStatDto> getLessonStatsByYear(int year);

    // lấy kết quả của tất cả user
    List<ResponseStatsResultDTO> findAllUserStats();
    List<ResponseStatsResultDTO> findAllUserStatsByUser(String keyword);
}

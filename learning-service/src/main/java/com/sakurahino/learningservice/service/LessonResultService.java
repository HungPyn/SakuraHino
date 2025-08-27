package com.sakurahino.learningservice.service;

import com.sakurahino.learningservice.dto.result.LessonResultRequestDTO;
import com.sakurahino.learningservice.dto.result.LessonResultResponseDTO;
import com.sakurahino.learningservice.dto.result.ResponseStatsResultDTO;

import java.util.List;


public interface LessonResultService {

    LessonResultResponseDTO create(LessonResultRequestDTO dto);



}

package com.sakurahino.learningservice.service;

import com.sakurahino.learningservice.dto.result.LessonResultRequestDTO;
import com.sakurahino.learningservice.dto.result.LessonResultResponseDTO;


public interface LessonResultService {

    LessonResultResponseDTO create(LessonResultRequestDTO dto);
}

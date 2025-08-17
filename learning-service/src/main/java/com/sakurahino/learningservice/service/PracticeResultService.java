package com.sakurahino.learningservice.service;

import com.sakurahino.learningservice.dto.result.PracticeResultRequestDTO;
import com.sakurahino.learningservice.dto.result.PracticeResultResponseDTO;

public interface PracticeResultService {

    PracticeResultResponseDTO create(PracticeResultRequestDTO dto);
}

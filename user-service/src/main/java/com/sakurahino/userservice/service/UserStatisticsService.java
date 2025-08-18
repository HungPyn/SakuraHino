package com.sakurahino.userservice.service;

import com.sakurahino.userservice.dto.PublicUserResponseDTO;

import java.util.List;
import java.util.Map;

public interface UserStatisticsService {

    public Map<String, Long> getUserRegistrationStats();

    public List<PublicUserResponseDTO> topStreaks();
    public List<PublicUserResponseDTO> topExp();
}

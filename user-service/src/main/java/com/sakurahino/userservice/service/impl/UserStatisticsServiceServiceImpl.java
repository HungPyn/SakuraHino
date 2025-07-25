package com.sakurahino.userservice.service.impl;

import com.sakurahino.userservice.repository.UserRepository;
import com.sakurahino.userservice.service.UserStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserStatisticsServiceServiceImpl implements UserStatisticsService {

    private final UserRepository userRepository;

    @Override
    public Map<String, Long> getUserRegistrationStats() {
        Map<String, Long> stats  = new HashMap<>();
        Instant dayCreation = Instant.now();
        stats.put("last7days", userRepository.countByDayCreationAfter(dayCreation.minus(7, ChronoUnit.DAYS)));
        stats.put("last30days", userRepository.countByDayCreationAfter(dayCreation.minus(30, ChronoUnit.DAYS)));
        stats.put("last90days", userRepository.countByDayCreationAfter(dayCreation.minus(90, ChronoUnit.DAYS)));
        return stats;
    }
}

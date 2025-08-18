package com.sakurahino.userservice.service.impl;

import com.sakurahino.userservice.dto.PublicUserResponseDTO;
import com.sakurahino.userservice.entity.User;
import com.sakurahino.userservice.mapper.UserServiceMapper;
import com.sakurahino.userservice.repository.UserRepository;
import com.sakurahino.userservice.service.UserStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserStatisticsServiceServiceImpl implements UserStatisticsService {

    private final UserServiceMapper userServiceMapper ;
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

    @Override
    public List<PublicUserResponseDTO> topStreaks() {
        List<User> users = userRepository.findTop10ByOrderByLongStreakDesc();
        List<PublicUserResponseDTO> responseDtos = users.stream()
                .map(userServiceMapper::toPublicUserResponseDTO)
                .collect(Collectors.toList());
        return responseDtos;
    }

    @Override
    public List<PublicUserResponseDTO> topExp() {
        List<User> users = userRepository.findTop10ByOrderByExpScoreDesc();
        List<PublicUserResponseDTO> responseDtos = users.stream()
                .map(userServiceMapper::toPublicUserResponseDTO)
                .collect(Collectors.toList());

        return responseDtos;
    }
}

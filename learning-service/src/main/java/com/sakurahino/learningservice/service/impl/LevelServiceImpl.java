package com.sakurahino.learningservice.service.impl;

import com.sakurahino.learningservice.dto.ResponseLevelDTO;
import com.sakurahino.learningservice.entity.Level;
import com.sakurahino.learningservice.repository.LevelRepository;
import com.sakurahino.learningservice.service.LevelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class LevelServiceImpl implements LevelService {

    private final LevelRepository levelRepository;

    @Override
    public List<ResponseLevelDTO> getAll() {
        List<Level> levels = levelRepository.findAll();
        return levels.stream()
                .map(level -> new ResponseLevelDTO(level.getId(), level.getName()))
                .toList();
    }

}

package com.sakurahino.learningservice.service.impl;

import com.sakurahino.learningservice.dto.LevelResponse;
import com.sakurahino.learningservice.entity.Level;
import com.sakurahino.learningservice.repository.LevelRepository;
import com.sakurahino.learningservice.service.LevelService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LevelServiceImpl  implements LevelService {

    private LevelRepository levelRepository;

    @Override
    public List<LevelResponse> getAll() {
        List<Level> levelList = levelRepository.findAll();

       return levelList.stream().map(level -> new LevelResponse(level.getId(),level.getName())).toList();
    }

}

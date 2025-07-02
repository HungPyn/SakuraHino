package com.sakurahino.topicservice.service.impl;

import com.sakurahino.topicservice.dto.LevelResponse;
import com.sakurahino.topicservice.entity.Level;
import com.sakurahino.topicservice.repository.LevelRepository;
import com.sakurahino.topicservice.service.LevelService;
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

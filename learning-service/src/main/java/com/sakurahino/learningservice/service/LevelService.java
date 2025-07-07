package com.sakurahino.learningservice.service;


import com.sakurahino.learningservice.dto.LevelResponse;

import java.util.List;

public interface LevelService {

    List<LevelResponse> getAll();
}

package com.sakurahino.toppicservice.service;

import com.sakurahino.toppicservice.entity.dto.ToppicResponseDto;

import java.util.List;

public interface ToppicService {
    List<ToppicResponseDto> getToppicsByIdLevel(Integer idLevel);


}

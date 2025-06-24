package com.sakurahino.toppicservice.service;

import com.sakurahino.toppicservice.entity.dto.ToppicRequestDto;
import com.sakurahino.toppicservice.entity.dto.ToppicResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ToppicService {
    List<ToppicResponseDto> getToppicsByIdLevel(Integer idLevel);

    ToppicResponseDto getToppicById (Integer id);

    ToppicResponseDto createToppic (ToppicRequestDto toppicRequestDto, MultipartFile multipartFile);
    ToppicResponseDto updateToppic (ToppicRequestDto toppicRequestDto, MultipartFile multipartFile);

    void deteteToppic (Integer toppicId);

}

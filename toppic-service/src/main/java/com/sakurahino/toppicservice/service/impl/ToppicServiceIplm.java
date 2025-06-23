package com.sakurahino.toppicservice.service.impl;

import com.sakurahino.toppicservice.entity.Toppic;
import com.sakurahino.toppicservice.entity.dto.ToppicResponseDto;
import com.sakurahino.toppicservice.repositorys.ToppicRepository;
import com.sakurahino.toppicservice.service.ToppicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ToppicServiceIplm implements ToppicService {
    private final ToppicRepository toppicRepository;

    @Override
    public List<ToppicResponseDto> getToppicsByIdLevel(Integer idLevel) {
        List<Toppic> toppics = toppicRepository.findTopicsByLevelId(idLevel);
        if(toppics.size() >=0 ){

        }
        List<ToppicResponseDto> ListDto = toppics.stream().map(toppic ->
                ToppicResponseDto.builder()
                        .id(toppic.getId())
                        .topicName(toppic.getTopicName())
                        .avatarUrl(toppic.getAvatarUrl())
                        .dayCreation(toppic.getDayCreation())
                        .levelId(toppic.getLevelId())
                        .build()
                ).collect(Collectors.toList());

        return ListDto;
    }
}

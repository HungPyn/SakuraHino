package com.example.resultservice.service;

import com.example.resultservice.dto.ResultRequestDto;
import com.example.resultservice.dto.ResultResponseDto;
import com.example.resultservice.dto.ResultResponseExamDto;
import com.example.resultservice.dto.ResultResponseLessonDto;

import java.util.List;
import java.util.UUID;

public interface ResultService {
    ResultResponseExamDto getResultExamByUser(Integer toppicId, UUID userId);

    ResultResponseLessonDto getResuleLessonByUser(Integer lessonId, UUID userId);

    void deleteResult(Integer id);

    ResultResponseDto saveResult(ResultRequestDto resultRequestDto);


    //Nội bộ

    ResultResponseExamDto getResultExamByUserForFeign(Integer toppicId, UUID userId);

    ResultResponseLessonDto getResuleLessonByUserForFeign(Integer lessonId, UUID userId);

}

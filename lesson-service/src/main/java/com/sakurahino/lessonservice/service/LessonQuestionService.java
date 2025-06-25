package com.sakurahino.lessonservice.service;

import com.sakurahino.lessonservice.dto.LessonQuestionResponse.LessonQuestionResponseDto;

import java.util.List;

public interface LessonQuestionService {
    List<LessonQuestionResponseDto> getAllQuestionByLessonId(Integer lessonId);

    LessonQuestionResponseDto getQuestionById (Integer id);
}

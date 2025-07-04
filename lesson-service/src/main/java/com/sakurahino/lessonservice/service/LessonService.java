package com.sakurahino.lessonservice.service;

import com.sakurahino.lessonservice.dto.lesson.LessonRequestDto;
import com.sakurahino.lessonservice.dto.lesson.LessonResponseDto;

import java.util.List;
import java.util.UUID;


public interface LessonService {
     List<LessonResponseDto> getLessonsByIdToppic(Integer idTopic, UUID userId) ;
     LessonResponseDto getlesonById(Integer idLesson, UUID userId);
     boolean isLesson(Integer idLesson);
     void delete (Integer idLesson);
     LessonResponseDto update (Integer id,LessonRequestDto lessonRequestDto);
     LessonResponseDto create (LessonRequestDto lessonRequestDto);


}

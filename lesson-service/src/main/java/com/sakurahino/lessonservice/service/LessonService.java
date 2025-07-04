package com.sakurahino.lessonservice.service;

import com.sakurahino.lessonservice.dto.lesson.LessonRequestDto;
import com.sakurahino.lessonservice.dto.lesson.LessonResponseDto;

import java.util.List;



public interface LessonService {
     List<LessonResponseDto> getLessonsByIdToppic(Integer idTopic) ;
     LessonResponseDto getlesonById(Integer idLesson);
     boolean isLesson(Integer idLesson);
     void delete (Integer idLesson);
     LessonResponseDto update (Integer id,LessonRequestDto lessonRequestDto);
     LessonResponseDto create (LessonRequestDto lessonRequestDto);


}

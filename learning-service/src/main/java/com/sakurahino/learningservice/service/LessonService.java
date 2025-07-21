package com.sakurahino.learningservice.service;

import com.sakurahino.learningservice.dto.LessonRequest;
import com.sakurahino.learningservice.dto.LessonResponse;

import java.util.List;

public interface LessonService {
    List<LessonResponse> getLessonByTopicIdAdmin(Integer topicId);
    LessonResponse getLessonById(Integer id);
    LessonResponse createLesson(LessonRequest lessonRequest);

    LessonResponse updateLesson(Integer id, LessonRequest lessonRequest);

    void deleteLesson(Integer id);


}

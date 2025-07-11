package com.sakurahino.learningservice.service;

import com.sakurahino.learningservice.dto.LessonQuestionResponse;

import java.util.List;

public interface QuestionService {
    List<LessonQuestionResponse> getQuestionsByTopicId(Integer topicId);
}

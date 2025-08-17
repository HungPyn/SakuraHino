package com.sakurahino.learningservice.service;

import com.sakurahino.learningservice.dto.question.LessonQuestionResponse;
import com.sakurahino.learningservice.dto.UserLessonCompleteRequest;

import java.util.List;

public interface UserLessonCompleteService {
    void saveComplete(UserLessonCompleteRequest completeRequest);

    void deleteComplete(Integer id);

    List<LessonQuestionResponse> getQuestionsTest();
}

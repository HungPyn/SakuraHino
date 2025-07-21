package com.sakurahino.learningservice.service;

import com.sakurahino.learningservice.dto.UserLessonCompleteRequest;

public interface UserLessonCompleteService {
    void saveComplete(UserLessonCompleteRequest completeRequest);

    void deleteComplete(Integer id);
}

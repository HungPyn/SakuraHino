package com.sakurahino.learningservice.service;

import com.sakurahino.learningservice.dto.UserLessonCompleteRequest;

public interface UserLessonCompleteService {
    boolean saveComplete(UserLessonCompleteRequest completeRequest);

    boolean deleteComplete(Integer id);
}

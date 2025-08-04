package com.sakurahino.learningservice.service;

import com.sakurahino.learningservice.dto.lesson.LessonWithStatusDTO;

import java.util.List;
import java.util.Map;

public interface UserLessonStatusService {

    // hàm này để mở topic chuyển trạng thái về UNLOCKED khi cp nhập lesson sang PUBLISHED nếu nó  giữa
    void unlockNewlyPublishedLessonForUsers(Integer lessonId);


    //user
    Map<String,List<LessonWithStatusDTO>> getLessonsWithStatusByUserAndTopic(String userId);
}

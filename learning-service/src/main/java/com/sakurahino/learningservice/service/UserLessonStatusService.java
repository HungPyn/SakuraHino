package com.sakurahino.learningservice.service;

import com.sakurahino.learningservice.dto.lesson.LessonWithStatusDTO;
import com.sakurahino.learningservice.entity.Lesson;
import com.sakurahino.learningservice.entity.Topic;
import com.sakurahino.learningservice.enums.ProgressStatus;

import java.util.List;
import java.util.Map;

public interface UserLessonStatusService {

    // hàm này để mở topic chuyển trạng thái về UNLOCKED khi cp nhập lesson sang PUBLISHED nếu nó  giữa
    void unlockNewlyPublishedLessonForUsers(Lesson lesson);


    //user
    Map<String, List<LessonWithStatusDTO>> getLessonsWithStatusByUserAndTopic(String userId);

    // tạo mới v cập nhập
    void updateLessonStatusAndUnlockNext(String userId, Lesson currentLesson, ProgressStatus newStatus);


    void unlockFirstLessonOfTopic(String userId,Topic topic);
}

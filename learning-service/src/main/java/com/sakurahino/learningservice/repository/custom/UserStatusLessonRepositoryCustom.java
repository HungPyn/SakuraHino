package com.sakurahino.learningservice.repository.custom;

import com.sakurahino.learningservice.dto.lesson.LessonWithStatusDTO;
import com.sakurahino.learningservice.entity.UserLessonStatus;

import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserStatusLessonRepositoryCustom {
    List<String> findUserIdToUnlockLesson(@Param("position")int currentPosition, @Param("lessonId")int lessonId);
    void batchInsertUserStatusLesson(List<UserLessonStatus> userLessonStatuses, int batchSize);

    //user
    List<LessonWithStatusDTO> findAllPublishedLessonsWithStatusByUser(@Param("userId") String userId);
}

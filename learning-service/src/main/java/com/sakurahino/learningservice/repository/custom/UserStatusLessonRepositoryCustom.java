package com.sakurahino.learningservice.repository.custom;

import com.sakurahino.learningservice.dto.lesson.LessonWithStatusDTO;
import com.sakurahino.learningservice.entity.UserLessonStatus;

import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserStatusLessonRepositoryCustom {

    List<Integer> findExistingLessonIdsForUser(@Param("userId") String userId, @Param("lessonIds") List<Integer> lessonIds);
    List<String> findUserIdToUnlockLesson(@Param("position")int currentPosition, @Param("lessonId")int lessonId);
    void batchInsertUserStatusLesson(List<UserLessonStatus> userLessonStatuses, int batchSize);

    //user
    List<LessonWithStatusDTO> findAllPublishedLessonsWithStatusByUser(@Param("userId") String userId);

    // phần này để check lesson đã pass ở topic chưa - > dùng ở ôn tập
    boolean areAllLessonsPassed(@Param("userId") String userId,@Param("topicCode") String topicCode);
}

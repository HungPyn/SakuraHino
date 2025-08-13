package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.Lesson;
import com.sakurahino.learningservice.entity.UserLessonStatus;
import com.sakurahino.learningservice.repository.custom.UserStatusLessonRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserStatusLessonRepository  extends JpaRepository<UserLessonStatus, Integer>, UserStatusLessonRepositoryCustom {
    Optional<UserLessonStatus> findByUserIdAndLessonId(String userId, Integer lessonId);
}

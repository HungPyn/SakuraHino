package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.UserLessonCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserLessonCompletionRepository extends JpaRepository<UserLessonCompletion, Integer> {
    Optional<UserLessonCompletion> findByUserIdAndAndLesson_Id(UUID userId, Integer lessonId);
}
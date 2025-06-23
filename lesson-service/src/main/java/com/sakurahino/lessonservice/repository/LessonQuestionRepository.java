package com.sakurahino.lessonservice.repository;

import com.sakurahino.lessonservice.entity.LessonQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonQuestionRepository extends JpaRepository<LessonQuestion, Integer> {
}
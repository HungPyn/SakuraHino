package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.LessonQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonQuestionRepository extends JpaRepository<LessonQuestion, Integer> {
}
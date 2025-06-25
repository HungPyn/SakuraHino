package com.sakurahino.lessonservice.repository;

import com.sakurahino.lessonservice.entity.LessonQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonQuestionRepository extends JpaRepository<LessonQuestion, Integer> {
    List<LessonQuestion> findByLesson_Id(Integer lessonId);
}
package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.LessonQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonQuestionRepository extends JpaRepository<LessonQuestion, Integer> {
    List<LessonQuestion> findLessonQuestionsByLesson_Id(Integer lessonId);
    List<LessonQuestion> findLessonQuestionsByLesson_IdOrderByIdDesc(Integer toppicId);
}
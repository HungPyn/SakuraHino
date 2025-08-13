package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.LessonQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonQuestionRepository extends JpaRepository<LessonQuestion, Integer> {
    List<LessonQuestion> findLessonQuestionsByLesson_Id(Integer lessonId);
    List<LessonQuestion> findLessonQuestionsByLesson_IdOrderByIdDesc(Integer toppicId);

    //user
    List<LessonQuestion> findLessonQuestionByLesson_Code(String lessonCode);

    @Query("""
    SELECT DISTINCT q FROM LessonQuestion q
    JOIN FETCH q.choices c
    JOIN FETCH q.lesson l
    JOIN l.topic t
    WHERE t.code = :topicCode
      AND l.status = com.sakurahino.learningservice.enums.LearningStatus.PUBLISHED
""")
    List<LessonQuestion> findAllByTopicCodeWithChoicesPublished(@Param("topicCode") String topicCode);

}
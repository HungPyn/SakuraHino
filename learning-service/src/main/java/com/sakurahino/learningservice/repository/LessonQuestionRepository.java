package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.LessonQuestion;
import com.sakurahino.learningservice.enums.LearningStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonQuestionRepository extends JpaRepository<LessonQuestion, Integer> {

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

// Lấy random câu hỏi từ topic, chỉ từ lesson published
    @Query(value = """
    SELECT q.* FROM lesson_questions q
    JOIN lessons l ON q.lesson_id = l.id
    JOIN topics t ON l.topic_id = t.topic_id
    WHERE t.status = :status
      AND l.status = :status
      AND t.topic_id = :topicId
    ORDER BY RAND()
    LIMIT :limit
    """, nativeQuery = true)
    List<LessonQuestion> findRandomPublishedQuestionsByTopic(
            @Param("topicId") Integer topicId,
            @Param("limit") int limit,
            @Param("status") String status
    );
}
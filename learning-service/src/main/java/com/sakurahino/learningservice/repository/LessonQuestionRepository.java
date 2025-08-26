package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.Lesson;
import com.sakurahino.learningservice.entity.LessonQuestion;
import com.sakurahino.learningservice.enums.LearningStatus;
import com.sakurahino.learningservice.enums.QuestionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonQuestionRepository extends JpaRepository<LessonQuestion, Integer> {

    List<LessonQuestion> findLessonQuestionByLesson_CodeAndStatus(String lessonCode, LearningStatus status);

    @Query("""
    SELECT DISTINCT q FROM LessonQuestion q
    JOIN FETCH q.choices c
    JOIN FETCH q.lesson l
    JOIN l.topic t
    WHERE t.code = :topicCode
      AND l.status = com.sakurahino.learningservice.enums.LearningStatus.PUBLISHED
      AND q.status = com.sakurahino.learningservice.enums.LearningStatus.PUBLISHED
""")
    List<LessonQuestion> findAllByTopicCodeWithChoicesPublished(@Param("topicCode") String topicCode);

// Lấy random câu hỏi từ topic, chỉ từ lesson published
@Query(value = """
    SELECT q.* 
    FROM lesson_questions q
    JOIN lessons l ON q.lesson_id = l.id
    JOIN topics t ON l.topic_id = t.topic_id
    WHERE q.status = :status
      AND l.status = :status
      AND t.status = :status
      AND t.topic_id = :topicId
    ORDER BY RAND()
    LIMIT :limit
    """, nativeQuery = true)
List<LessonQuestion> findRandomPublishedQuestionsByTopic(
        @Param("topicId") Integer topicId,
        @Param("limit") int limit,
        @Param("status") String status
);

    //admin
    // Lấy tất cả LessonQuestion của một Lesson theo thứ tự tạo mới nhất
    Page<LessonQuestion> findAllByLesson_IdOrderByCreatedAtDesc(Integer lessonId, Pageable pageable);

    // đếm số lượng xem đã đạt đủ số lượng câu hỏi chưa ?
    @Query("SELECT COUNT(q) FROM LessonQuestion q WHERE q.lesson.id = :lessonId AND q.status = :status")
    int countQuestions(@Param("lessonId") Integer lessonId, @Param("status") LearningStatus status);


    //check xem câu hỏi đã tồn tại chưa
    boolean existsByLessonIdAndTargetWordNativeIgnoreCaseAndQuestionType(
            Integer lessonId,
            String targetWordNative,
            QuestionType questionType
    );

    boolean existsByLessonIdAndTargetWordNativeIgnoreCaseAndQuestionTypeAndIdNot(
            Integer lessonId,
            String targetWordNative,
            QuestionType questionType,
            Integer currentQuestionId
    );


    // Tìm 1 LessonQuestion có targetWordNative và targetLanguageCode trùng, audioUrl khác null
    Optional<LessonQuestion> findTop1ByTargetWordNativeAndTargetLanguageCodeAndAudioUrlIsNotNull(
            String targetWordNative,
            String targetLanguageCode
    );
}
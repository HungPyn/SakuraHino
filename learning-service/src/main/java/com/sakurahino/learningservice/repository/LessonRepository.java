package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.dto.LessonResponse;
import com.sakurahino.learningservice.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Integer> {
    @Query("SELECT new com.sakurahino.learningservice.dto.LessonResponse(" +
            "l.id, l.lessonName, l.dayCreation, l.topic.id, " +
            "CASE WHEN ulc.id IS NOT NULL THEN TRUE ELSE l.complete END) " +
            "FROM Lesson l " +
            "LEFT JOIN UserLessonCompletion ulc ON l.id = ulc.lesson.id AND ulc.userId = :userId " +
            "WHERE l.topic.id = :topicId")
    List<LessonResponse> findLessonsWithUserCompletionStatusByTopicIdAndUserId(
            @Param("topicId") Integer topicId,
            @Param("userId") UUID userId
    );
    //----------
    List<Lesson> findLessonsByTopic_IdOrderByIdDesc(Integer topicId);
}
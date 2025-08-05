package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.Lesson;
import com.sakurahino.learningservice.enums.LearningStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Integer> {

    //----------
    List<Lesson> findLessonsByTopic_IdOrderByIdDesc(Integer topicId);

    Page<Lesson> findAllByTopic_IdOrderByCreatedAtDesc(Integer topicId,Pageable pageable);

    boolean existsByLessonName(String lessonName);

    boolean existsByCode(String code);

    @Query("SELECT MAX(l.position) FROM Lesson l WHERE l.topic.id = :topicId")
    Integer findMaxPositionByTopicId(@Param("topicId") Integer topicId);

    boolean existsByLessonNameAndTopicId(String lessonName, Integer topicId);

    Long countByTopicIdAndStatus(Integer topicId, LearningStatus status);
}
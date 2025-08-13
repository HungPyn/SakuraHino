package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.Lesson;
import com.sakurahino.learningservice.entity.Topic;
import com.sakurahino.learningservice.enums.LearningStatus;
import com.sakurahino.learningservice.enums.ResultStatus;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Integer> {

    //----------
    List<Lesson> findLessonsByTopic_IdOrderByIdDesc(Integer topicId);

    Page<Lesson> findAllByTopic_IdOrderByCreatedAtDesc(Integer topicId,Pageable pageable);

    boolean existsByCode(String code);

    @Query("SELECT MAX(l.position) FROM Lesson l WHERE l.topic.id = :topicId")
    Integer findMaxPositionByTopicId(@Param("topicId") Integer topicId);

    boolean existsByLessonNameAndTopicId(String lessonName, Integer topicId);

    Long countByTopicIdAndStatus(Integer topicId, LearningStatus status);

    Lesson findByCode(String code);


    @Query("SELECT l FROM Lesson l " +
            "WHERE l.topic.id = :topicId " +
            "AND l.status = :status " +
            "AND l.position > :currentPosition " +
            "ORDER BY l.position ASC")
    List<Lesson> findNextPublishedLesson(
            @Param("topicId") Integer topicId,
            @Param("status") LearningStatus status,
            @Param("currentPosition") Integer currentPosition
    );


    Lesson findFirstByTopicOrderByPositionAsc(Topic topic);
}
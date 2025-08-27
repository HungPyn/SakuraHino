package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.Lesson;
import com.sakurahino.learningservice.entity.Topic;
import com.sakurahino.learningservice.enums.LearningStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Integer> {

    Page<Lesson> findAllByTopic_IdOrderByCreatedAtDesc(Integer topicId, Pageable pageable);

    boolean existsByCode(String code);

    @Query("SELECT MAX(l.position) FROM Lesson l WHERE l.topic.id = :topicId")
    Integer findMaxPositionByTopicId(@Param("topicId") Integer topicId);

    boolean existsByLessonNameIgnoreCaseAndTopicId(String lessonName, Integer topicId);

    boolean existsByLessonNameIgnoreCaseAndTopicIdAndIdNot(String lessonName, Integer topicId, Integer lessonId);


    Long countByTopicIdAndStatus(Integer topicId, LearningStatus status);

    @Query("SELECT l FROM Lesson l " +
            "WHERE (:tuKhoa IS NULL OR l.lessonName LIKE CONCAT('%', :tuKhoa, '%')) " +
            "  AND (:topicId IS NULL OR l.topic.id = :topicId) " +
            "  AND (:status IS NULL OR l.status = :status) " +
            "  AND (:startDate IS NULL OR l.createdAt >= :startDate) " +
            "  AND (:endDate IS NULL OR l.createdAt < :endDate)")
    Page<Lesson> findByFilters(
            @Param("tuKhoa") String tuKhoa,
            @Param("topicId") Integer topicId,
            @Param("status") LearningStatus status,
            @Param("startDate") ZonedDateTime startDate,
            @Param("endDate") ZonedDateTime endDate,
            Pageable pageable);

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

    @Query("""
        SELECT l.id 
        FROM Lesson l
        WHERE l.topic.id = :topicId
          AND l.status = com.sakurahino.learningservice.enums.LearningStatus.PUBLISHED
        ORDER BY l.position ASC
    """)
    List<Integer> findLessonIdsByTopicId(@Param("topicId") Integer topicId);

    // check xem có phải là first lesson đầu tiên được public ra không
    @Query("SELECT COUNT(l) > 0 FROM Lesson l " +
            "WHERE l.topic.id = :topicId AND l.id <> :lessonId AND l.status = 'PUBLISHED'")
    boolean existsOtherPublishedLesson(@Param("topicId") Integer topicId,
                                       @Param("lessonId") Integer lessonId);


    long countByCreatedAtBefore(ZonedDateTime dateTime);

    long countByCreatedAtBeforeAndStatus(ZonedDateTime createdAtBefore, LearningStatus status);
    long countByStatus(LearningStatus status);

    @Query(
            value = "SELECT DATE_FORMAT(create_at, '%Y-%m') AS month, COUNT(*) AS count " +
                    "FROM lessons " +
                    "WHERE create_at BETWEEN :start AND :end " +
                    "GROUP BY DATE_FORMAT(create_at, '%Y-%m') " +
                    "ORDER BY month",
            nativeQuery = true
    )
    List<Object[]> countByMonth(@Param("start") LocalDateTime start,
                                @Param("end") LocalDateTime end);
}

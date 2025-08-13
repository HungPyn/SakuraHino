package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.LessonResult;
import com.sakurahino.learningservice.enums.ResultStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface LessonResultRepository  extends JpaRepository<LessonResult, Integer> {

    @Query("""
           SELECT COUNT(l) > 0
           FROM LessonResult l
           WHERE l.userId = :userId
             AND l.status = :status
             AND l.completedAt >= :startOfDay
           """)
    boolean existsByUserIdAndStatusAfter(@Param("userId") String userId,
                                         @Param("status") ResultStatus status,
                                         @Param("startOfDay") Instant startOfDay);

    @Query("SELECT MAX(lr.correctCount) FROM LessonResult lr WHERE lr.userId = :userId AND lr.lesson.id = :lessonId")
    Optional<Integer> findMaxCorrectCountByUserIdAndLessonId(String userId, Integer lessonId);


}

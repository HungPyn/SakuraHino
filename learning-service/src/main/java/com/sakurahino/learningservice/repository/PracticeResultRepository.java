package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.PracticeResult;
import com.sakurahino.learningservice.enums.ResultStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface PracticeResultRepository extends JpaRepository<PracticeResult, Integer> {

// check xem đã pass ở ôn tập chưa
    @Query("""
        SELECT COUNT(p) > 0
        FROM PracticeResult p
        WHERE p.userId = :userId
          AND p.topic.code = :topicCode
          AND p.status = :status
       """)
    boolean existsPassedPractice(@Param("userId") String userId,
                                 @Param("topicCode") String topicCode,
                                 @Param("status") ResultStatus status);


    Optional<Integer> findMaxCorrectCountByUserIdAndTopicId(String userId, Integer id);


    @Query("""
           SELECT COUNT(pr) > 0
           FROM PracticeResult pr
           WHERE pr.userId = :userId
             AND pr.status = :status
             AND pr.completedAt >= :startOfDay
           """)
    boolean existsByUserIdAndStatusAfter(@Param("userId") String userId,
                                         @Param("status") ResultStatus status,
                                         @Param("startOfDay") Instant startOfDay);
}

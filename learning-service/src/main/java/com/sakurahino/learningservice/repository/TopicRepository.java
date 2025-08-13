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

import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Integer> {

    //admin
    Page<Topic> findAllByOrderByCreateAtDesc(Pageable pageable);

    boolean existsByCode(String code);

    @Query("SELECT MAX(t.position) FROM Topic t")
    Integer findMaxPosition();

    Topic findByCode(String code);

    @Query("SELECT t FROM Topic t " +
            "WHERE t.status = :status " +
            "AND t.position > :currentPosition " +
            "ORDER BY t.position ASC")
    List<Topic> findNextPublishedTopic(
            @Param("status") LearningStatus status,
            @Param("currentPosition") Integer currentPosition
    );
}

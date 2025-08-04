package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.Topic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Integer> {

    //admin
    Page<Topic> findAllByOrderByCreateAtDesc(Pageable pageable);

    List<Topic> findByPositionBetweenOrderByPositionAsc(int positionAfter, int positionAfter1);

    boolean existsByCode(String code);

    Integer findMaxPosition();
}

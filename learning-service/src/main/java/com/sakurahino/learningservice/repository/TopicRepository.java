package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.Topic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface TopicRepository extends JpaRepository<Topic, Integer> {
    Page<Topic> findTopicsByOrderByCreateAtDesc(Pageable pageable);
}

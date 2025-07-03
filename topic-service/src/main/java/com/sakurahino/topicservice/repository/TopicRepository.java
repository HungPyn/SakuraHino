package com.sakurahino.topicservice.repository;

import com.sakurahino.topicservice.dto.TopicResponse;
import com.sakurahino.topicservice.entity.Topic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TopicRepository extends JpaRepository<Topic, String> {
    Page<Topic> findAllByLevel_IdOrderByCreateAtAsc(Integer levelId, Pageable pageable);

    Page<Topic> findAllByLevel_IdOrderByCreateAtDesc(Integer levelId,Pageable pageable);
}

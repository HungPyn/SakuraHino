package com.sakurahino.topicservice.repository;

import com.sakurahino.topicservice.entity.Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface LevelRepository  extends JpaRepository<Level, Integer> {

}

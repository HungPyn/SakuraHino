package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface LevelRepository  extends JpaRepository<Level, Integer> {

}

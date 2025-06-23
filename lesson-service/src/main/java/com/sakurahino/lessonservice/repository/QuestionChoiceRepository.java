package com.sakurahino.lessonservice.repository;

import com.sakurahino.lessonservice.entity.QuestionChoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionChoiceRepository extends JpaRepository<QuestionChoice, Integer> {
}
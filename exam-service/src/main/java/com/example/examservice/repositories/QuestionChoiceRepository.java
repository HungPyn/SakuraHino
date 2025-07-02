package com.example.examservice.repositories;

import com.example.examservice.entity.QuestionChoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface QuestionChoiceRepository extends JpaRepository<QuestionChoice, Integer> {
List<QuestionChoice> findQuestionChoicesByExamQuestionId(Integer idExamQuestion);
}
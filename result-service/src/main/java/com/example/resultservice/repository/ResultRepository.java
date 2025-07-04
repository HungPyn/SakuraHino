package com.example.resultservice.repository;

import com.example.resultservice.dto.ResultResponseExamDto;
import com.example.resultservice.dto.ResultResponseLessonDto;
import com.example.resultservice.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResultRepository extends JpaRepository<Result, Integer> {
    Optional<Result> findResultByToppicIdAndUserId(Integer toppicId,UUID userId);
    Optional<Result> findResultByLessonIdAndUserId (Integer lessonId,UUID userId);

}
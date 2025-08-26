package com.sakurahino.learningservice.repository;


import com.sakurahino.learningservice.entity.QuestionChoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionChoiceRepository extends JpaRepository<QuestionChoice, Integer> {
    List<QuestionChoice> findQuestionChoicesByLessonQuestionId(Integer questionId);


    // dùng ở audio
    Optional<QuestionChoice> findTop1ByTextForeignAndAudioUrlForeignIsNotNull(String textForeign);
}
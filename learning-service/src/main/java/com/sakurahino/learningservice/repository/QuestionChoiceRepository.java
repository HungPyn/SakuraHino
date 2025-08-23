package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.LessonQuestion;
import com.sakurahino.learningservice.entity.QuestionChoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionChoiceRepository extends JpaRepository<QuestionChoice, Integer> {
    List<QuestionChoice> findQuestionChoicesByLessonQuestionId(Integer questionId);


    // dùng ở audio
    @Query("SELECT q FROM QuestionChoice q WHERE q.textForeign = :text AND q.audioUrlForeign IS NOT NULL")
    Optional<QuestionChoice> findFirstByTextForeignAndAudioUrlForeignIsNotNull(@Param("text") String textForeign);
}
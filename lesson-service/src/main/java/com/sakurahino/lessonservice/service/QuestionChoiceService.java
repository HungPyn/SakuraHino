package com.sakurahino.lessonservice.service;

import com.sakurahino.lessonservice.dto.questionChoice.QuestionChoiceResponseDto;

import java.util.List;

public interface QuestionChoiceService {
    List<QuestionChoiceResponseDto> getAllChoiceByIdLessonQuestion(Integer lessonQuestionId);


}

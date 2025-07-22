package com.sakurahino.learningservice.service;

import com.sakurahino.learningservice.dto.LessonQuestionRequest;
import com.sakurahino.learningservice.dto.LessonQuestionResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface QuestionService {
    List<LessonQuestionResponse> getQuestionsByLessonId(Integer topicId);
    List<LessonQuestionResponse> getQuestionsByLessonIdAdmin(Integer topicId);
    LessonQuestionResponse getQuestionById(Integer id);

    void deleteQuestion(Integer id);

    void createQuestion(LessonQuestionRequest lessonQuestionRequest);
    void updateQuestion(Integer id, LessonQuestionRequest lessonQuestionRequest);

    void importQuestionFromeExcel (Integer lessonId, MultipartFile excelFile);

}

package com.sakurahino.learningservice.service;

import com.sakurahino.learningservice.dto.question.LessonQuestionRequest;
import com.sakurahino.learningservice.dto.question.LessonQuestionResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface QuestionService {

    // sử dụng cho user
    List<LessonQuestionResponse> getQuestionsForUser(String code);
    List<LessonQuestionResponse> getQuestionsPractice(String code,int limit);
    List<LessonQuestionResponse> getQuestionsTestForUser();


    List<LessonQuestionResponse> getQuestionsByLessonIdAdmin(Integer topicId);
    LessonQuestionResponse getQuestionById(Integer id);

    void deleteQuestion(Integer id);

    void createQuestion(LessonQuestionRequest lessonQuestionRequest);
    void updateQuestion(Integer id, LessonQuestionRequest lessonQuestionRequest);

    void importQuestionFromeExcel (Integer lessonId, MultipartFile excelFile);

}

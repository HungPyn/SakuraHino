package com.sakurahino.learningservice.service;

import com.sakurahino.common.dto.PaginatedResponse;
import com.sakurahino.learningservice.dto.question.LessonQuestionRequest;
import com.sakurahino.learningservice.dto.question.LessonQuestionResponse;
import com.sakurahino.learningservice.dto.topic.TopicResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface QuestionService {

    // sử dụng cho user
    List<LessonQuestionResponse> getQuestionsForUser(String code);
    List<LessonQuestionResponse> getQuestionsPractice(String code,int limit);
    List<LessonQuestionResponse> getQuestionsTestForUser();


    // sử dụng cho admin
    PaginatedResponse<LessonQuestionResponse> getAllForAdmin(Integer lessonId,int page, int size);
    LessonQuestionResponse getQuestionById(Integer questionId);
    LessonQuestionResponse create(LessonQuestionRequest data, Map<String, MultipartFile> imageFilesMap);
    LessonQuestionResponse update(Integer questionId,LessonQuestionRequest data);
    void delete(Integer questionId);

}

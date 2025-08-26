package com.sakurahino.learningservice.service;

import com.sakurahino.learningservice.dto.question.LessonQuestionRequest;
import org.springframework.web.multipart.MultipartFile;

public interface ImportExcelForQuestionService {

    void  importExcelForQuestion(MultipartFile file);
}

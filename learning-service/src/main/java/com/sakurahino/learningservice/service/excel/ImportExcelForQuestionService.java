package com.sakurahino.learningservice.service.excel;

import org.springframework.web.multipart.MultipartFile;

public interface ImportExcelForQuestionService {

    void  importExcelForQuestion(MultipartFile file);
}

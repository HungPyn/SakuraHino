package com.example.examservice.service;
import com.example.examservice.dto.exam.ExamQuestionRequestDto;
import com.example.examservice.dto.exam.ExamQuestionResponseDto;

import java.util.List;

public  interface ExamQuestionService {
    List<ExamQuestionResponseDto> getAllExamQuestionByToppicId(Integer toppicId);

    ExamQuestionResponseDto getExamQuestionById (Integer id);

    void create (ExamQuestionRequestDto examQuestionRequestDto);
    void delete (Integer id);

    void update (Integer id,ExamQuestionRequestDto examQuestionRequestDto);
}

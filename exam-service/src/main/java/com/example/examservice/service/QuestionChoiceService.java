package com.example.examservice.service;

import com.example.examservice.dto.choiceExam.ChoiceRequestCreateDto;
import com.example.examservice.dto.choiceExam.QuestionChoiceRequestDto;
import com.example.examservice.dto.choiceExam.QuestionChoiceResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface QuestionChoiceService {
    List<QuestionChoiceResponseDto> getChoicesByIdExamQuestion(Integer idExam);

    void deleteChoice(Integer id);
    QuestionChoiceResponseDto create(ChoiceRequestCreateDto choiceRequestCreateDto, MultipartFile avatarChoice);


    boolean saveChoices(List<QuestionChoiceRequestDto> questionChoiceRequestDto, Integer idExam);



}

package com.sakurahino.lessonservice.service;

import com.sakurahino.lessonservice.dto.questionChoice.ChoiceRequestCreateDto;
import com.sakurahino.lessonservice.dto.questionChoice.QuestionChoiceRequestDto;
import com.sakurahino.lessonservice.dto.questionChoice.QuestionChoiceResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface QuestionChoiceService {
    List<QuestionChoiceResponseDto> getAllChoiceByIdLessonQuestion(Integer lessonQuestionId);
    List<QuestionChoiceResponseDto> getAllChoiceByExamId(Integer examId);
    boolean deleteChoiceByExamId (Integer examId);

    void deleteChoice(Integer id);


    boolean saveChoices(List<QuestionChoiceRequestDto> questionChoiceRequestDto, Integer idQuestion);

    boolean saveChoicesExam(List<QuestionChoiceRequestDto> questionChoiceRequestDto, Integer idQuestionExam);

    QuestionChoiceResponseDto create(ChoiceRequestCreateDto choiceRequestCreateDto, MultipartFile avatarChoice);

}

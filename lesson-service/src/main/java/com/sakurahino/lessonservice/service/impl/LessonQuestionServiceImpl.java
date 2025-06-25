package com.sakurahino.lessonservice.service.impl;


import com.sakurahino.lessonservice.dto.LessonQuestionResponse.LessonQuestionResponseDto;
import com.sakurahino.lessonservice.dto.questionChoice.QuestionChoiceResponseDto;
import com.sakurahino.lessonservice.entity.LessonQuestion;
import com.sakurahino.lessonservice.repository.LessonQuestionRepository;
import com.sakurahino.lessonservice.service.LessonQuestionService;
import com.sakurahino.lessonservice.service.QuestionChoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonQuestionServiceImpl implements LessonQuestionService {
    private final LessonQuestionRepository lessonQuestionRepository;
    private final QuestionChoiceService questionChoiceService;

    @Override
    public List<LessonQuestionResponseDto> getAllQuestionByLessonId(Integer lessonId) {
        List<LessonQuestion> lessonQuestions = lessonQuestionRepository.findByLesson_Id(lessonId);
        List<LessonQuestionResponseDto> responseDtos = lessonQuestions.stream().map(lessonQuestion -> {
            LessonQuestionResponseDto responseDto = LessonQuestionResponseDto.builder()
                    .id(lessonQuestion.getId())
                    .LessonId(lessonQuestion.getLesson().getId())
                    .audioUrlQuestions(lessonQuestion.getAudioUrlQuestions())
                    .questionType(lessonQuestion.getQuestionType())
                    .promptTextTemplate(lessonQuestion.getPromptTextTemplate())
                    .targetWordNative(lessonQuestion.getTargetWordNative())
                    .targetLanguageCode(lessonQuestion.getTargetLanguageCode())
                    .optionsLanguageCode(lessonQuestion.getOptionsLanguageCode())
                    .build();
            List<QuestionChoiceResponseDto> questionChoiceResponseDtos =
                    questionChoiceService.getAllChoiceByIdLessonQuestion(lessonQuestion.getId());
            responseDto.setQuestionChoices(questionChoiceResponseDtos);
            return responseDto;
        }).collect(Collectors.toList());

        return responseDtos;
    }

    @Override
    public LessonQuestionResponseDto getQuestionById(Integer id) {
        Optional<LessonQuestion> questionOptional = lessonQuestionRepository.findById(id);
        if(questionOptional.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Question không tồn tại");
        }
        List<QuestionChoiceResponseDto> choiceResponseDtos = questionChoiceService.getAllChoiceByIdLessonQuestion(questionOptional.get().getId());

        LessonQuestionResponseDto questionResponseDto = LessonQuestionResponseDto.builder()
                .id(questionOptional.get().getId())
                .LessonId(questionOptional.get().getLesson().getId())
                .audioUrlQuestions(questionOptional.get().getAudioUrlQuestions())
                .questionType(questionOptional.get().getQuestionType())
                .promptTextTemplate(questionOptional.get().getPromptTextTemplate())
                .targetWordNative(questionOptional.get().getTargetWordNative())
                .targetLanguageCode(questionOptional.get().getTargetLanguageCode())
                .optionsLanguageCode(questionOptional.get().getOptionsLanguageCode())
                .build();
        questionResponseDto.setQuestionChoices(choiceResponseDtos);

        return questionResponseDto;
    }

}

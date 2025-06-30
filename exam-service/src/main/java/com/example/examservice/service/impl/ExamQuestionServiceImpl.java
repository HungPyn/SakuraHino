package com.example.examservice.service.impl;

import com.example.examservice.clients.LessonServiceClient;
import com.example.examservice.dto.ExamQuestionRequestDto;
import com.example.examservice.dto.ExamQuestionResponseDto;
import com.example.examservice.dto.QuestionChoiceResponseDto;
import com.example.examservice.entity.ExamQuestion;
import com.example.examservice.repositories.ExamQuestionRepository;
import com.example.examservice.service.ExamQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ExamQuestionServiceImpl implements ExamQuestionService {
    private final ExamQuestionRepository examQuestionRepository;

    private final LessonServiceClient lessonServiceClient;

    @Override
    public List<ExamQuestionResponseDto> getAllExamQuestionByToppicId(Integer toppicId) {

        //sau bổ sung kiểm tra toppic tồn tại trước khi lấy ra----------------------------------------------------------

        List<ExamQuestion> examQuestions = examQuestionRepository.findExamQuestionsByToppicId(toppicId);

        System.out.println("exams là ákjdhasd:  "+ examQuestions);

        List<ExamQuestionResponseDto> responseDtos = examQuestions.stream().map(examQuestion -> {
                    if (examQuestion.getId() == null) {
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chưa có idExam");
                    }
                    List<QuestionChoiceResponseDto> responseChoice = lessonServiceClient.getChoicesByExamId(examQuestion.getId());

                    return ExamQuestionResponseDto.builder()
                            .id(examQuestion.getId())
                            .toppicId(examQuestion.getToppicId())
                            .audioUrlQuestions(examQuestion.getAudioUrlQuestions())
                            .questionType(examQuestion.getQuestionType())
                            .promptTextTemplate(examQuestion.getPromptTextTemplate())
                            .targetWordNative(examQuestion.getTargetWordNative())
                            .targetLanguageCode(examQuestion.getTargetLanguageCode())
                            .optionsLanguageCode(examQuestion.getOptionsLanguageCode())
                            .questionChoices(responseChoice)
                            .build();
                }

        ).collect(Collectors.toList());

        return responseDtos;
    }

    @Override
    public ExamQuestionResponseDto getExamQuestionById(Integer id) {
        Optional<ExamQuestion> questionOptional = examQuestionRepository.findById(id);
        if(questionOptional.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"exam không tồn tại");
        }
        ExamQuestion examQuestion = questionOptional.get();

        List<QuestionChoiceResponseDto> choiceDtos = lessonServiceClient.getChoicesByExamId(examQuestion.getId());
        ExamQuestionResponseDto responseDto = ExamQuestionResponseDto.builder()
                .id(examQuestion.getId())
                .toppicId(examQuestion.getToppicId())
                .audioUrlQuestions(examQuestion.getAudioUrlQuestions())
                .questionType(examQuestion.getQuestionType())
                .promptTextTemplate(examQuestion.getPromptTextTemplate())
                .targetWordNative(examQuestion.getTargetWordNative())
                .targetLanguageCode(examQuestion.getTargetLanguageCode())
                .optionsLanguageCode(examQuestion.getOptionsLanguageCode())
                .questionChoices(choiceDtos)
                .build();
        return responseDto;
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Optional<ExamQuestion> questionOptional = examQuestionRepository.findById(id);
        if(questionOptional.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"exam không tồn tại");
        }
        examQuestionRepository.deleteById(questionOptional.get().getId());
        lessonServiceClient.deleteChoiceByExamId(questionOptional.get().getId());
    }

    @Override
    public void create(ExamQuestionRequestDto examQuestionRequestDto) {

    }



    @Override
    public void update(Integer id, ExamQuestionRequestDto examQuestionRequestDto) {

    }
}

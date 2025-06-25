package com.sakurahino.lessonservice.service.impl;

import com.sakurahino.lessonservice.dto.questionChoice.QuestionChoiceResponseDto;
import com.sakurahino.lessonservice.entity.QuestionChoice;
import com.sakurahino.lessonservice.repository.QuestionChoiceRepository;
import com.sakurahino.lessonservice.service.QuestionChoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionChoiceServiceImpl implements QuestionChoiceService {
    private final QuestionChoiceRepository questionChoiceRepository;


    @Override
    public List<QuestionChoiceResponseDto> getAllChoiceByIdLessonQuestion(Integer lessonQuestionId) {
        List<QuestionChoice> questionChoices = questionChoiceRepository.findByLessonQuestion_Id(lessonQuestionId);
        List<QuestionChoiceResponseDto> responseDtos = questionChoices.stream().map(questionChoice ->
                QuestionChoiceResponseDto.builder()
                        .id(questionChoice.getId())
                        .lessonQuestionId(questionChoice.getLessonQuestion().getId())
                        .examQuestionId(questionChoice.getExamQuestionId())
                        .textForeign(questionChoice.getTextForeign())
                        .textRomaji(questionChoice.getTextRomaji())
                        .imageUrl(questionChoice.getImageUrl())
                        .audioUrlForeign(questionChoice.getAudioUrlForeign())
                        .isCorrect(questionChoice.getIsCorrect())
                        .textBlock(questionChoice.getTextBlock())
                        .meaning(questionChoice.getMeaning())
                        .build()
                ).collect(Collectors.toList());

        return responseDtos;
    }
}

package com.sakurahino.learningservice.service.impl;

import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.ex.ResourceException;
import com.sakurahino.learningservice.dto.QuestionChoiceResponse;
import com.sakurahino.learningservice.entity.LessonQuestion;
import com.sakurahino.learningservice.entity.QuestionChoice;
import com.sakurahino.learningservice.mapper.ChoiceMapper;
import com.sakurahino.learningservice.repository.LessonQuestionRepository;
import com.sakurahino.learningservice.repository.QuestionChoiceRepository;
import com.sakurahino.learningservice.service.QuestionChoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionChoiceServiceImpl implements QuestionChoiceService {
    private final QuestionChoiceRepository questionChoiceRepository;
    private final LessonQuestionRepository lessonQuestionRepository;
    private final ChoiceMapper choiceMapper;

}

package com.sakurahino.learningservice.service.impl;

import com.sakurahino.learningservice.mapper.ChoiceMapper;
import com.sakurahino.learningservice.repository.LessonQuestionRepository;
import com.sakurahino.learningservice.repository.QuestionChoiceRepository;
import com.sakurahino.learningservice.service.QuestionChoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuestionChoiceServiceImpl implements QuestionChoiceService {
    private final QuestionChoiceRepository questionChoiceRepository;
    private final LessonQuestionRepository lessonQuestionRepository;
    private final ChoiceMapper choiceMapper;

}

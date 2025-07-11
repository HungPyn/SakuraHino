package com.sakurahino.learningservice.service.impl;

import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.ex.ResourceException;
import com.sakurahino.learningservice.dto.LessonQuestionResponse;
import com.sakurahino.learningservice.entity.LessonQuestion;
import com.sakurahino.learningservice.entity.Topic;
import com.sakurahino.learningservice.mapper.ChoiceMapper;
import com.sakurahino.learningservice.mapper.LessonQuestionMapper;
import com.sakurahino.learningservice.repository.LessonQuestionRepository;
import com.sakurahino.learningservice.repository.QuestionChoiceRepository;
import com.sakurahino.learningservice.repository.TopicRepository;
import com.sakurahino.learningservice.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {
    private final QuestionChoiceRepository questionChoiceRepository ;
    private final LessonQuestionRepository  lessonQuestionRepository;

    private final LessonQuestionMapper lessonQuestionMapper;
    private final ChoiceMapper choiceMapper;
    private final TopicRepository topicRepository;

    @Override
    public List<LessonQuestionResponse> getQuestionsByTopicId(Integer topicId) {
        Topic topic = topicRepository.findById(topicId).orElseThrow(()-> new
                        ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Toppic không tồn tại{}"+ topicId)
                );

        List<LessonQuestion> lessonQuestions = lessonQuestionRepository.findAll();

        List<LessonQuestionResponse> lessonQuestionResponses =
                lessonQuestions.stream().map(lessonQuestionMapper:: mapQuestionResponse).collect(Collectors.toList());
        return lessonQuestionResponses;
    }
}

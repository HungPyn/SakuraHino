package com.sakurahino.learningservice.service.impl;

import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.ex.ResourceException;
import com.sakurahino.learningservice.dto.LessonRequest;
import com.sakurahino.learningservice.dto.LessonResponse;
import com.sakurahino.learningservice.entity.Lesson;
import com.sakurahino.learningservice.entity.Topic;
import com.sakurahino.learningservice.mapper.LessonMapper;
import com.sakurahino.learningservice.repository.LessonRepository;
import com.sakurahino.learningservice.repository.TopicRepository;
import com.sakurahino.learningservice.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {
    private final LessonRepository lessonRepository;
    private final TopicRepository topicRepository;

    private final LessonMapper lessonMapper;
    @Override
    public List<LessonResponse> getLessonByTopicIdAdmin(Integer topicId) {
        List<Lesson> lessons = lessonRepository.findLessonsByTopic_IdOrderByIdDesc(topicId);
        List<LessonResponse> lessonResponses = lessons.stream().map(
                lessonMapper :: maptoLessonResponse
        ).collect(Collectors.toList());
        return lessonResponses;
    }

    @Override
    public LessonResponse getLessonById(Integer id) {
        Lesson lesson = lessonRepository.findById(id).orElseThrow(()->
                new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Lesson không tồn tại"));
        LessonResponse lessonResponse = lessonMapper.maptoLessonResponse(lesson);
        return lessonResponse;
    }

    @Override
    public LessonResponse createLesson(LessonRequest lessonRequest) {
        Topic topic = topicRepository.findById(lessonRequest.getTopicId()).orElseThrow((()->
                new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(),"Topic không tồn tại")));
        Lesson lesson = Lesson.builder()
                .lessonName(lessonRequest.getLessonName())
                .dayCreation(Instant.now())
                .topic(topic)
                .complete(false)
                .build();

        lessonRepository.save(lesson);
        LessonResponse response = lessonMapper.maptoLessonResponse(lesson);
        return response;
    }

    @Override
    public LessonResponse updateLesson(Integer id, LessonRequest lessonRequest) {
        Lesson lesson = lessonRepository.findById(id).orElseThrow((()->
                new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(),"Lesson không tồn tại id: "+id)));
        if(lesson.getTopic().getId() != lessonRequest.getTopicId()){
            throw new  ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(),"Topic chưa chính xác");
        }
         lesson.setLessonName(lessonRequest.getLessonName());
        lesson.setComplete(false);

        lessonRepository.save(lesson);
        LessonResponse response = lessonMapper.maptoLessonResponse(lesson);
        return response;
    }

    @Override
    public void deleteLesson(Integer id) {
        Lesson lesson = lessonRepository.findById(id).orElseThrow((()->
                new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(),"Lesson không tồn tại id: "+id)));
        lessonRepository.delete(lesson);
    }
}

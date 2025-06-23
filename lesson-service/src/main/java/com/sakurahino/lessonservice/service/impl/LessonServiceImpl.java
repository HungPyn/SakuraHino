package com.sakurahino.lessonservice.service.impl;

import com.sakurahino.lessonservice.dto.lesson.LessonRequestDto;
import com.sakurahino.lessonservice.dto.lesson.LessonResponseDto;
import com.sakurahino.lessonservice.entity.Lesson;
import com.sakurahino.lessonservice.repository.LessonRepository;
import com.sakurahino.lessonservice.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {
    private final LessonRepository lessonRepository;
    @Override
    public List<LessonResponseDto> getLessonsByIdToppic(Integer idTopic) {
        List<Lesson> lessons = lessonRepository.getLessonsByTopicId(idTopic);

        List<LessonResponseDto> lessonsResponse = lessons.stream().map(lesson -> {
            return LessonResponseDto.builder()
                    .id(lesson.getId())
                    .lessonName(lesson.getLessonName())
                    .dayCreation(lesson.getDayCreation())
                    .topicId(lesson.getTopicId()).build();
        }).collect(Collectors.toList());

        return lessonsResponse;
    }

    @Override
    public LessonResponseDto getlesonById(Integer idLesson) {
        Optional<Lesson> lessonOptional = lessonRepository.findById(idLesson);
        if(lessonOptional.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Không tìm thấy lestion");
        }
        LessonResponseDto lessonResponseDto = LessonResponseDto.builder()
                .id(lessonOptional.get().getId())
                .lessonName(lessonOptional.get().getLessonName())
                .dayCreation(lessonOptional.get().getDayCreation())
                .topicId(lessonOptional.get().getTopicId())
                .build();
        return lessonResponseDto;
    }

    @Override
    public void delete(Integer idLesson) {

    }

    @Override
    public void update(Integer idLesson, LessonRequestDto lessonRequestDto) {

    }

    @Override
    public void create(LessonRequestDto lessonRequestDto) {

    }
}

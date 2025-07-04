package com.sakurahino.lessonservice.service.impl;

import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.ex.ResourceException;
import com.sakurahino.lessonservice.clients.ResultServiceClient;
import com.sakurahino.lessonservice.clients.ToppicServiceClient;
import com.sakurahino.lessonservice.dto.lesson.LessonRequestDto;
import com.sakurahino.lessonservice.dto.lesson.LessonResponseDto;
import com.sakurahino.lessonservice.dto.ressult.ResultResponseExamDto;
import com.sakurahino.lessonservice.dto.ressult.ResultResponseLessonDto;
import com.sakurahino.lessonservice.entity.Lesson;
import com.sakurahino.lessonservice.repository.LessonRepository;
import com.sakurahino.lessonservice.service.LessonService;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {
    private final LessonRepository lessonRepository;
    private final ToppicServiceClient toppicServiceClient;
    private final ResultServiceClient resultServiceClient;

    @Override
    public List<LessonResponseDto> getLessonsByIdToppic(Integer idTopic, UUID userId) {
        if (userId == null) {
            throw new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Chưa truyền lên userId");
        }
        List<Lesson> lessons = lessonRepository.getLessonsByTopicId(idTopic);

        //cần bổ sung isComplete gọi đến service result để lấy kết quả.
        List<LessonResponseDto> lessonsResponse = lessons.stream().map(lesson -> {
            return LessonResponseDto.builder()
                    .id(lesson.getId())
                    .lessonName(lesson.getLessonName())
                    .dayCreation(lesson.getDayCreation())
                    .topicId(lesson.getTopicId()).build();
        }).collect(Collectors.toList());


        if (lessonsResponse.size() >= 1) {
            for (LessonResponseDto lessonsDto : lessonsResponse) {
                ResultResponseLessonDto lessonDto = resultServiceClient.getResultLessson(lessonsDto.getId(), userId);
                if(lessonDto != null){
                    lessonsDto.setComplete(lessonDto.getIsComplete());
                }else{
                    lessonsDto.setComplete(false);
                }

            }

            LessonResponseDto lessonLyThuyet = LessonResponseDto.builder()
                    .lessonName("Lý thuyết")
                    .topicId(idTopic)
                    //bổ sung iscomplete nếu có
                    .build();

            LessonResponseDto lessonKiemTra = LessonResponseDto.builder()
                    .lessonName("Kiểm tra")
                    .topicId(idTopic)
                    .isComplete(false)
                    .build();

            // Thêm "Lý thuyết chung" vào ĐẦU danh sách
            lessonsResponse.add(0, lessonLyThuyet);


            ResultResponseExamDto examDto = resultServiceClient.getResultExam(idTopic, userId);
            if (examDto != null) {
                lessonKiemTra.setComplete(examDto.getIsComplete());
            }
            //Thêm "Bài kiểm tra cuối bài" vào CUỐI danh sách
            lessonsResponse.add(lessonKiemTra);
        }

        return lessonsResponse;
    }

    @Override
    public LessonResponseDto getlesonById(Integer idLesson, UUID userId) {
        Optional<Lesson> lessonOptional = lessonRepository.findById(idLesson);
        if (lessonOptional.isEmpty()) {
            throw new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Không tìm thấy lesson");
        }
        //cần bổ sung isComplete gọi đến service result để lấy kết quả.

        LessonResponseDto lessonResponseDto = LessonResponseDto.builder()
                .id(lessonOptional.get().getId())
                .lessonName(lessonOptional.get().getLessonName())
                .dayCreation(lessonOptional.get().getDayCreation())
                .topicId(lessonOptional.get().getTopicId())
                .isComplete(false)
                .build();
        ResultResponseLessonDto lessonDto = resultServiceClient.getResultLessson(idLesson, userId);

        if(lessonDto != null){
            lessonResponseDto.setComplete(lessonDto.getIsComplete());
        }

        return lessonResponseDto;
    }

    @Override
    public boolean isLesson(Integer idLesson) {
        Optional<Lesson> lessonOptional = lessonRepository.findById(idLesson);
        if (lessonOptional.isEmpty()) {
            return false;
        }
        return true;
    }

    @Override
    public void delete(Integer idLesson) {
        Optional<Lesson> lesson = lessonRepository.findById(idLesson);
        if (lesson.isEmpty()) {
            throw new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Không tìm thấy lesson");
        }
        lessonRepository.deleteById(idLesson);
    }

    @Override
    public LessonResponseDto update(Integer id, LessonRequestDto lessonRequestDto) {
        boolean isToppic = toppicServiceClient.isToppic(lessonRequestDto.getTopicId());
        if (isToppic == false) {
            throw new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Toppic không tồn tại");
        }

        Optional<Lesson> lessonOptional = lessonRepository.findById(id);
        if (lessonOptional.isEmpty()) {
            throw new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Lesson không tồn tại");
        }
        Lesson lesson = Lesson.builder()
                .id(lessonOptional.get().getId())
                .lessonName(lessonRequestDto.getLessonName())
                .dayCreation(lessonOptional.get().getDayCreation())
                .topicId(lessonRequestDto.getTopicId())
                .build();

        lessonRepository.save(lesson);

        LessonResponseDto responseDto = LessonResponseDto.builder()
                .id(lesson.getId())
                .lessonName(lesson.getLessonName())
                .dayCreation(lesson.getDayCreation())
                .topicId(lesson.getTopicId())
                .build();
        return responseDto;
    }

    @Override
    public LessonResponseDto create(LessonRequestDto lessonRequestDto) {
        boolean isToppic = toppicServiceClient.isToppic(lessonRequestDto.getTopicId());
        if (isToppic == false) {
            throw new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Toppic không tồn tại");
        }
        Lesson lesson = Lesson.builder()
                .lessonName(lessonRequestDto.getLessonName())
                .dayCreation(Instant.now())
                .topicId(lessonRequestDto.getTopicId())
                .build();

        lessonRepository.save(lesson);

        LessonResponseDto responseDto = LessonResponseDto.builder()
                .id(lesson.getId())
                .lessonName(lesson.getLessonName())
                .dayCreation(lesson.getDayCreation())
                .topicId(lesson.getTopicId())
                .build();
        return responseDto;
    }
}

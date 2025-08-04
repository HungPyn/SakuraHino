package com.sakurahino.learningservice.service.impl;

import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.ex.ResourceException;
import com.sakurahino.learningservice.dto.LessonQuestionResponse;
import com.sakurahino.learningservice.dto.UserLessonCompleteRequest;
import com.sakurahino.learningservice.entity.UserTopicStatus;
import com.sakurahino.learningservice.repository.LessonRepository;
import com.sakurahino.learningservice.repository.UserTopicStatusRepository;
import com.sakurahino.learningservice.service.UserLessonCompleteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserLessonCompleteServiceImpl implements UserLessonCompleteService {
    private final UserTopicStatusRepository userCompletionRepository;
    private final LessonRepository lessonRepository;


    @Override
    public void saveComplete(UserLessonCompleteRequest completeRequest) {
//        Lesson lesson = lessonRepository.findById(completeRequest.getLessonId()).orElseThrow(() -> new ResourceException
//                (ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Không tìm thấy lesson này (id): " + completeRequest.getLessonId()));
//
//        Optional<UserTopicStatus> completionOptional = userCompletionRepository.findByUserIdAndAndLesson_Id(
//                completeRequest.getUserId(), completeRequest.getLessonId());
//        if(completionOptional.isEmpty()){
//            UserTopicStatus lessonCompletion = UserTopicStatus.builder()
//                    .userId(completeRequest.getUserId())
//                    .lesson(lesson)
//                    .completedAt(Instant.now())
//                    .build();
//
//            userCompletionRepository.save(lessonCompletion);
//        }
    }

    @Override
    public void deleteComplete(Integer id) {
        Optional<UserTopicStatus> userLessonCompletion = userCompletionRepository.findById(id);
        if(userLessonCompletion.isEmpty()){
           throw new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Không tìm kết quả này (id): "+id);
        }
        userCompletionRepository.delete(userLessonCompletion.get());
    }

    // ném ra 1 list câu hỏi để test
    @Override
    public List<LessonQuestionResponse> getQuestionsTest() {
        return List.of();
    }
}

package com.sakurahino.learningservice.service.impl;

import com.sakurahino.learningservice.dto.UserLessonCompleteRequest;
import com.sakurahino.learningservice.entity.Lesson;
import com.sakurahino.learningservice.entity.UserLessonCompletion;
import com.sakurahino.learningservice.repository.LessonRepository;
import com.sakurahino.learningservice.repository.UserLessonCompletionRepository;
import com.sakurahino.learningservice.service.UserLessonCompleteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserLessonCompleteServiceImpl implements UserLessonCompleteService {
    private final UserLessonCompletionRepository userCompletionRepository;
    private final LessonRepository lessonRepository;


    @Override
    public boolean saveComplete(UserLessonCompleteRequest completeRequest) {
        Lesson lesson = lessonRepository.findById(completeRequest.getLessonId()).orElse(null);
        if (lesson == null) {
            log.info("Không tìm thấy lesson với id: "+completeRequest.getLessonId());
            return false;
        }
        Optional<UserLessonCompletion> completionOptional = userCompletionRepository.findByUserIdAndAndLesson_Id(
                completeRequest.getUserId(), completeRequest.getLessonId());
        if(completionOptional.isPresent()){
            return true;
        }else {
            UserLessonCompletion lessonCompletion = UserLessonCompletion.builder()
                    .userId(completeRequest.getUserId())
                    .lesson(lesson)
                    .completedAt(Instant.now())
                    .build();

            userCompletionRepository.save(lessonCompletion);
            return true;
        }
    }

    @Override
    public boolean deleteComplete(Integer id) {
        Optional<UserLessonCompletion> userLessonCompletion = userCompletionRepository.findById(id);
        if(userLessonCompletion.isEmpty()){
            log.info("Không tìm thấy completion để xóa với id: {}", id);
            return false;
        }
        userCompletionRepository.delete(userLessonCompletion.get());
        return true;
    }
}

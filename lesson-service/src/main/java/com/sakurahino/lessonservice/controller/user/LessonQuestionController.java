package com.sakurahino.lessonservice.controller.user;

import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.lessonservice.dto.LessonQuestionResponse.LessonQuestionResponseDto;
import com.sakurahino.lessonservice.service.LessonQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/lesson")
public class LessonQuestionController {
    private  final LessonQuestionService lessonQuestionService;
    @GetMapping("/question/{id}")
    public SuccessResponse getQuestionsByIdLesson(@PathVariable("id") Integer idLesson){
        return new SuccessResponse(lessonQuestionService.getAllQuestionByLessonId(idLesson));
    }
    @GetMapping("/getquestion/{id}")
    public SuccessResponse getQuestionById(@PathVariable("id") Integer idLesson){
         LessonQuestionResponseDto lessonQuestionResponseDto =  lessonQuestionService.getQuestionById(idLesson);
        return new SuccessResponse(lessonQuestionResponseDto);
    }

}

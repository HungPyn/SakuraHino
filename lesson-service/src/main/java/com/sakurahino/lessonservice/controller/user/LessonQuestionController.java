package com.sakurahino.lessonservice.controller.user;

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
    public List<LessonQuestionResponseDto> getQuestionsByIdLesson(@PathVariable("id") Integer idLesson){
        return lessonQuestionService.getAllQuestionByLessonId(idLesson);
    }
    @GetMapping("/getQuestion/{id}")
    public ResponseEntity<LessonQuestionResponseDto> getQuestionById(@PathVariable("id") Integer idLesson){
         LessonQuestionResponseDto lessonQuestionResponseDto =  lessonQuestionService.getQuestionById(idLesson);
        return ResponseEntity.ok(lessonQuestionResponseDto);
    }

}

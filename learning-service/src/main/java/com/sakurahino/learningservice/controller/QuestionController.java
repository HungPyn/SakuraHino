package com.sakurahino.learningservice.controller;

import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.learningservice.dto.LessonQuestionResponse;
import com.sakurahino.learningservice.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/question")
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping("/user/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public SuccessResponse getQuesstionsByToppicId(@PathVariable("id") Integer toppicId){
      List<LessonQuestionResponse> response = questionService.getQuestionsByTopicId(toppicId);
      return new SuccessResponse(response);
    }
}

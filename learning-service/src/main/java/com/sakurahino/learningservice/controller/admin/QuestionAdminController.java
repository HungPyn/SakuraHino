package com.sakurahino.learningservice.controller.admin;

import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.learningservice.dto.question.LessonQuestionRequest;
import com.sakurahino.learningservice.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/learning/admin/questions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class QuestionAdminController {

    private final QuestionService questionService;

    @GetMapping
    public SuccessResponse getAllQuestions(
            @RequestParam("lessonId") Integer lessonId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        var response = questionService.getAllForAdmin(lessonId,page, size);

        return new SuccessResponse(response);
    }

    @GetMapping("/{lessonId}")
    public SuccessResponse getQuestionById(@PathVariable Integer lessonId) {
        var response = questionService.getQuestionById(lessonId);
        return new SuccessResponse(response);
    }




    @PatchMapping("/{questionId}")
    public SuccessResponse deleteQuestionById(@PathVariable Integer questionId) {
        questionService.delete(questionId);
        return new SuccessResponse();
    }
}

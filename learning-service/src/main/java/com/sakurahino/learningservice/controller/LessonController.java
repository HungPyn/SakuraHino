package com.sakurahino.learningservice.controller;


import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.learningservice.dto.LessonRequest;
import com.sakurahino.learningservice.dto.LessonResponse;
import com.sakurahino.learningservice.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/lesson")
@RequiredArgsConstructor
public class LessonController {
    private final LessonService lessonService;

    @GetMapping("/user/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public SuccessResponse getLessonById(@PathVariable("id") Integer id){
        LessonResponse lessonResponse = lessonService.getLessonById(id);
        return new SuccessResponse(lessonResponse);
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public SuccessResponse getLessonByTopicId(@PathVariable("id") Integer topicId){
        List<LessonResponse> lessonResponses = lessonService.getLessonByTopicIdAdmin(topicId);
        return new SuccessResponse(lessonResponses);
    }
    @PostMapping("/admin/create")
    @PreAuthorize("hasRole('ADMIN')")
    public SuccessResponse createLesson(@Valid @RequestBody LessonRequest lessonRequest){
        LessonResponse lessonResponse = lessonService.createLesson(lessonRequest);
        return new SuccessResponse(lessonResponse);
    }
    @PutMapping("/admin/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public SuccessResponse updateLesson(@PathVariable("id") Integer id, @Valid @RequestBody LessonRequest lessonRequest){
        LessonResponse lessonResponse = lessonService.updateLesson(id,lessonRequest);
        return new SuccessResponse(lessonResponse);
    }

    @DeleteMapping("/admin/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public SuccessResponse deleteLesson(@PathVariable("id") Integer id){
       lessonService.deleteLesson(id);
        return new SuccessResponse("Xóa thành công");
    }


}

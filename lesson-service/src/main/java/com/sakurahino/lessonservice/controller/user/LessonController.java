package com.sakurahino.lessonservice.controller.user;

import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.lessonservice.dto.lesson.LessonResponseDto;
import com.sakurahino.lessonservice.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
//@PreAuthorize("hasRole('USER')")
@RequestMapping("/user/lesson")
public class LessonController {
    private final LessonService lessonService;
    @GetMapping("/lessons")
    public SuccessResponse getLessionsById(@RequestParam("toppicId") Integer toppicId,
                                           @RequestParam("userId") UUID userId){
        return new SuccessResponse(lessonService.getLessonsByIdToppic(toppicId,  userId)) ;
    }

    @GetMapping("/lesson")
    public SuccessResponse  getLessonByid(@RequestParam("id") Integer lesonId,
                                          @RequestParam("userId") UUID userId){
        LessonResponseDto responseDto = lessonService.getlesonById(lesonId,userId);
        return new SuccessResponse(responseDto);
    }
}

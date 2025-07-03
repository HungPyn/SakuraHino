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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
//@PreAuthorize("hasRole('USER')")
@RequestMapping("/user/lesson")
public class LessonController {
    private final LessonService lessonService;
    @GetMapping("/{idToppic}")
    public SuccessResponse getLessionsByIdToppic(@PathVariable("idToppic") Integer idToppic){
        return new SuccessResponse(lessonService.getLessonsByIdToppic(idToppic)) ;
    }

    @GetMapping("/getLesson/{id}")
    public SuccessResponse  getLessonByid(@PathVariable("id") Integer id){
        LessonResponseDto responseDto = lessonService.getlesonById(id);
        return new SuccessResponse(responseDto);
    }
}

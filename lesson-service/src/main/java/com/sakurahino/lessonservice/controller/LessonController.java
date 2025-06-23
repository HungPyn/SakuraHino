package com.sakurahino.lessonservice.controller;

import com.sakurahino.lessonservice.dto.lesson.LessonResponseDto;
import com.sakurahino.lessonservice.service.LessonService;
import lombok.RequiredArgsConstructor;
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
    public List<LessonResponseDto> getLessionsByIdToppic(@PathVariable("idToppic") Integer idToppic){
        return lessonService.getLessonsByIdToppic(idToppic);
    }

}

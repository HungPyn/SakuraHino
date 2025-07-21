package com.sakurahino.learningservice.controller;

import com.sakurahino.learningservice.dto.UserLessonCompleteRequest;
import com.sakurahino.learningservice.service.UserLessonCompleteService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/topic")
@RequiredArgsConstructor
public class UserLessonCompleteController {
    private final UserLessonCompleteService userLessonCompleteService;
    //cho service result nội bộ
    @PostMapping("/comlete/create")
    @PreAuthorize("hasRole('ADMIN')")
    public boolean createCompelete(@RequestParam("userId")UUID userId,
                                   @RequestParam("lessonId") Integer lessonId){
        UserLessonCompleteRequest completeRequest = new UserLessonCompleteRequest() ;
        completeRequest.setUserId(userId);
        completeRequest.setLessonId(lessonId);
        return userLessonCompleteService.saveComplete(completeRequest);
    }
    @DeleteMapping ("/comlete/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public boolean createCompelete(@PathVariable("id") Integer id){
        return userLessonCompleteService.deleteComplete(id);
    }
}

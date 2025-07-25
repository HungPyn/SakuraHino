package com.sakurahino.learningservice.controller;

import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.learningservice.dto.UserLessonCompleteRequest;
import com.sakurahino.learningservice.service.UserLessonCompleteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
    public SuccessResponse createCompelete(@Valid @RequestBody UserLessonCompleteRequest completeRequest){
        userLessonCompleteService.saveComplete(completeRequest);
        return new SuccessResponse("Thêm kết quả thành công");
    }
    @DeleteMapping ("/complete/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public SuccessResponse createCompelete(@PathVariable("id") Integer id){
         userLessonCompleteService.deleteComplete(id);
        return new SuccessResponse("Xóa thành công");
    }
}

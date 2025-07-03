package com.sakurahino.lessonservice.controller.admin;

import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.lessonservice.dto.lesson.LessonRequestDto;
import com.sakurahino.lessonservice.dto.lesson.LessonResponseDto;
import com.sakurahino.lessonservice.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/lesson")
public class LessonAdminController {
    private final LessonService lessonService;

    @PostMapping("/create")
    public SuccessResponse createLesson(@Valid @RequestBody LessonRequestDto lessonRequestDto){
        LessonResponseDto lessonResponseDto = lessonService.create(lessonRequestDto);
        return new SuccessResponse(lessonResponseDto);
    }

    @PutMapping("/update/{id}")
    public SuccessResponse updateLesson(
            @PathVariable("id") Integer id,
            @Valid @RequestBody LessonRequestDto lessonRequestDto){
        LessonResponseDto lessonResponseDto = lessonService.update(id,lessonRequestDto);
        return new SuccessResponse(lessonResponseDto);
    }

    @DeleteMapping("/delete/{id}")
    public SuccessResponse delete (@PathVariable("id") Integer id){
        lessonService.delete(id);
        return new SuccessResponse("Xóa thành công");
    }

}

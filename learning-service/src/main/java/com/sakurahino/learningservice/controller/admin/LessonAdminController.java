package com.sakurahino.learningservice.controller.admin;


import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.learningservice.dto.lesson.LessonRequestDTO;
import com.sakurahino.learningservice.dto.lesson.LessonResponseDTO;
import com.sakurahino.learningservice.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/learning/admin/lessons")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class LessonAdminController {
    private final LessonService lessonService;

    @GetMapping("/{id}")
    public SuccessResponse getLessonById(@PathVariable("id") Integer id){
        LessonResponseDTO lessonResponse = lessonService.getLessonById(id);
        return new SuccessResponse(lessonResponse);
    }

    @GetMapping()
    public SuccessResponse getAllForAdmin(
            @RequestParam("topicId") Integer topicId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        var result = lessonService.getLessonByTopicIdAdmin(topicId,page, size);
        return new SuccessResponse(result);
    }
    @GetMapping("/filters")
    public SuccessResponse findByFilters(
            @RequestParam("topicId") Integer topicId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String tuKhoa,
            @RequestParam(required = false) Instant startDate,
            @RequestParam(required = false) Instant endDate,
            @RequestParam(required = false) String status) {
        var result = lessonService.findByFilters(tuKhoa,topicId,status,startDate,endDate,page, size);
        return new SuccessResponse(result);
    }
    @PostMapping
    public SuccessResponse createLesson(@Valid @RequestBody LessonRequestDTO lessonRequest){
        LessonResponseDTO lessonResponse = lessonService.create(lessonRequest);
        return new SuccessResponse(lessonResponse);
    }

    @PutMapping("/{id}")
    public SuccessResponse updateLesson(@PathVariable("id") Integer id, @Valid @RequestBody LessonRequestDTO lessonRequest){
        LessonResponseDTO lessonResponse = lessonService.update(id,lessonRequest);
        return new SuccessResponse(lessonResponse);
    }

    @PatchMapping("/{id}")
    public SuccessResponse deleteLesson(@PathVariable("id") Integer id){
       lessonService.delete(id);
        return new SuccessResponse("Xóa thành công");
    }


}

package com.example.resultservice.controller.admin;


import com.example.resultservice.dto.ResultResponseExamDto;
import com.example.resultservice.dto.ResultResponseLessonDto;
import com.example.resultservice.service.ResultService;
import com.sakurahino.common.retresponse.SuccessResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/result")
public class ResultAdminController {
    private final ResultService resultService;

    @DeleteMapping("/delete/{id}")
    public SuccessResponse deleteResult(@PathVariable("id")Integer id){
        resultService.deleteResult(id);
        return new SuccessResponse("Xóa kết quả thành công");
    }


//api nội bộ cho các service khác
    @GetMapping("/lesson")
    public ResultResponseLessonDto getResultLesson(@RequestParam("lessonId") Integer lessonId, @RequestParam("userId") UUID userId){
        return resultService.getResuleLessonByUserForFeign(lessonId, userId);
    }
    @GetMapping("/exam")
    public ResultResponseExamDto getResultExam(@RequestParam("toppicId") Integer toppicId, @RequestParam("userId")UUID userId){
        return resultService.getResultExamByUserForFeign(toppicId, userId);
    }
}

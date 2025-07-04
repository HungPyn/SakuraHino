package com.example.resultservice.controller.user;

import com.example.resultservice.dto.ResultRequestDto;
import com.example.resultservice.dto.ResultResponseDto;
import com.example.resultservice.service.ResultService;
import com.sakurahino.common.retresponse.SuccessResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/result")
public class ResultController {
    private final ResultService resultService;
    @GetMapping("/lesson")
    public SuccessResponse getResultLesson(@RequestParam("lessonId") Integer lessonId, @RequestParam("userId")UUID userId){
       return new SuccessResponse(resultService.getResuleLessonByUser(lessonId, userId));
    }
    @GetMapping("/exam")
    public SuccessResponse getResultExam(@RequestParam("toppicId") Integer toppicId, @RequestParam("userId")UUID userId){
        return new SuccessResponse(resultService.getResultExamByUser(toppicId, userId));
    }

    @PostMapping("/create")
    public SuccessResponse createRessult(@Valid @RequestBody ResultRequestDto resultRequestDto){
        ResultResponseDto responseDto = resultService.saveResult(resultRequestDto);
        System.out.println("userId là:"+resultRequestDto.getUserId());
        return new SuccessResponse(responseDto);
    }
}

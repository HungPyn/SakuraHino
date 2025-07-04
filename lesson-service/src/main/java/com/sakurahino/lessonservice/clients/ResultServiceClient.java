package com.sakurahino.lessonservice.clients;

import com.sakurahino.lessonservice.dto.ressult.ResultResponseExamDto;
import com.sakurahino.lessonservice.dto.ressult.ResultResponseLessonDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@FeignClient(name = "result-service")
public interface ResultServiceClient {
    @GetMapping("/admin/result/lesson")
    ResultResponseLessonDto getResultLessson(@RequestParam("lessonId") Integer lessonId, @RequestParam("userId")UUID userId);

    @GetMapping("/admin/result/exam")
    ResultResponseExamDto getResultExam(@RequestParam("toppicId") Integer toppicId, @RequestParam("userId")UUID userId);

}

package com.example.resultservice.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "lesson-service")
public interface LessonServiceClient {
    @GetMapping("/admin/lesson/getLesson/{id}")
    boolean isLesson (@PathVariable("id") Integer idLesson);
}

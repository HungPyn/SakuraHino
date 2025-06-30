package com.example.examservice.clients;

import com.example.examservice.dto.QuestionChoiceResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "lesson-service")
public interface LessonServiceClient {
    @GetMapping("/admin/lesson/choice/{id}")
    List<QuestionChoiceResponseDto> getChoicesByExamId( @PathVariable("id") Integer examId);

    @DeleteMapping("/admin/lesson/choice/deletebyexam/{id}")
     boolean deleteChoiceByExamId(@PathVariable("id") Integer examId);

    @DeleteMapping("/admin/lesson/choice/delete/{id}")
     void deleteChoice(@PathVariable("id") Integer id);

}

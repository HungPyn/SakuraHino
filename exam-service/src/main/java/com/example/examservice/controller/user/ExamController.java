package com.example.examservice.controller.user;

import com.example.examservice.dto.ExamQuestionResponseDto;
import com.example.examservice.service.ExamQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/exam")
public class ExamController {
    private final ExamQuestionService examQuestionService;
    @GetMapping("/{id}")
    public List<ExamQuestionResponseDto> getExamsByToppicId(@PathVariable("id")Integer toppicId){
        return examQuestionService.getAllExamQuestionByToppicId(toppicId);
    }

    @GetMapping("/getexam/{id}")
    public ResponseEntity<ExamQuestionResponseDto> getExamById(@PathVariable("id")Integer id){
         ExamQuestionResponseDto responseDto = examQuestionService.getExamQuestionById(id);
        return ResponseEntity.ok(responseDto);
    }

}

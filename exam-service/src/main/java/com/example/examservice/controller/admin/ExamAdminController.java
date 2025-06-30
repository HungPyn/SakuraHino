package com.example.examservice.controller.admin;

import com.example.examservice.clients.LessonServiceClient;
import com.example.examservice.service.ExamQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/exam")
public class ExamAdminController {
    private final ExamQuestionService examQuestionService;
    private final LessonServiceClient lessonServiceClient;
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletebyId(@PathVariable("id") Integer id){
        examQuestionService.delete(id);
        return ResponseEntity.ok("Xóa thành công");
    }

    @DeleteMapping("/deletechoice/{id}")
    public ResponseEntity<String> deletebyChoiceId(@PathVariable("id") Integer id){
        lessonServiceClient.deleteChoice(id);
        return ResponseEntity.ok("Xóa đáp án thành công");
    }


}

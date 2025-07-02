package com.example.examservice.controller.admin;

import com.example.examservice.dto.exam.ExamQuestionRequestDto;
import com.example.examservice.service.ExamQuestionService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/exam")
public class ExamAdminController {
    private final ExamQuestionService examQuestionService;

    private final ObjectMapper objectMapper = new ObjectMapper();
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletebyId(@PathVariable("id") Integer id){
        examQuestionService.delete(id);
        return ResponseEntity.ok("Xóa exam thành công");
    }


    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createQuestion(@RequestPart("examQuestion") String lessonQuestionStr,
                                                 @RequestPart("choiceImages") List<MultipartFile> choiceImages
    ) {
        ExamQuestionRequestDto requestDto;
        try {
            requestDto = objectMapper.readValue(lessonQuestionStr, ExamQuestionRequestDto.class);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dữ liệu exam không hợp lệ: " + e.getMessage());
        }

        if (choiceImages != null && !choiceImages.isEmpty()) {
            for (int i = 0; i < choiceImages.size() && i < requestDto.getQuestionChoices().size(); i++) {
                requestDto.getQuestionChoices().get(i).setImageFile(choiceImages.get(i));
            }
        }

        examQuestionService.create(requestDto);

        return ResponseEntity.ok("Thêm exam thành công <3");

    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateQuestion(
            @PathVariable("id") Integer id, @RequestPart("examQuestion") String lessonQuestionStr,
            @RequestPart("choiceImages") List<MultipartFile> choiceImages
    ) {
        ExamQuestionRequestDto requestDto;
        try {
            requestDto = objectMapper.readValue(lessonQuestionStr, ExamQuestionRequestDto.class);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dữ liệu exam không hợp lệ: " + e.getMessage());
        }

        if (choiceImages != null && !choiceImages.isEmpty()) {
            for (int i = 0; i < choiceImages.size() && i < requestDto.getQuestionChoices().size(); i++) {
                requestDto.getQuestionChoices().get(i).setImageFile(choiceImages.get(i));
            }
        }

        examQuestionService.update(id, requestDto);

        return ResponseEntity.ok("Cập nhật exam thành công <3");
    }

}

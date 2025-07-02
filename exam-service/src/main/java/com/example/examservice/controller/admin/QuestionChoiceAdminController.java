package com.example.examservice.controller.admin;

import com.example.examservice.dto.choiceExam.ChoiceRequestCreateDto;
import com.example.examservice.dto.choiceExam.QuestionChoiceResponseDto;
import com.example.examservice.service.QuestionChoiceService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/exam/choice")
public class QuestionChoiceAdminController {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final QuestionChoiceService questionChoiceService;

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteChoice(@PathVariable("id") Integer id) {
        questionChoiceService.deleteChoice(id);
        return ResponseEntity.ok("xóa đáp án thành công");
    }
    @PostMapping(value = "/create", consumes = {"multipart/form-data"})
    public ResponseEntity<QuestionChoiceResponseDto> createChoice(@RequestPart("choice") String choiceStr,
                                                                  @RequestPart("choiceImage") MultipartFile choiceImage) {

        ChoiceRequestCreateDto choiceRequestCreateDto;
        try {
            choiceRequestCreateDto = objectMapper.readValue(choiceStr, ChoiceRequestCreateDto.class);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dữ liệu đáp án không hợp lệ: " + e.getMessage());
        }
        QuestionChoiceResponseDto response = questionChoiceService.create(choiceRequestCreateDto, choiceImage);
        return ResponseEntity.ok(response);
    }
}

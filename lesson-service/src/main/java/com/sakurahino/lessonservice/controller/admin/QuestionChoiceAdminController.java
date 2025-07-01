package com.sakurahino.lessonservice.controller.admin;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sakurahino.lessonservice.dto.questionChoice.ChoiceRequestCreateDto;
import com.sakurahino.lessonservice.dto.questionChoice.QuestionChoiceRequestDto;
import com.sakurahino.lessonservice.dto.questionChoice.QuestionChoiceResponseDto;
import com.sakurahino.lessonservice.service.QuestionChoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/lesson/choice")
public class QuestionChoiceAdminController {
    private final QuestionChoiceService questionChoiceService;

    private final ObjectMapper objectMapper = new ObjectMapper();

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


    //api nội bộ cho exam

    @DeleteMapping("/deletebyexam/{id}")
    public boolean deleteChoiceByExaam(@PathVariable("id") Integer examId) {
        boolean isDeleted = questionChoiceService.deleteChoiceByExamId(examId);
        return isDeleted;
    }

    @GetMapping("/{id}")
    public List<QuestionChoiceResponseDto> getChoicesByExamId(@PathVariable("id") Integer examId) {
        return questionChoiceService.getAllChoiceByExamId(examId);
    }

    @PostMapping("/createxam/{id}")
    public boolean creatateExam(@RequestBody List<QuestionChoiceRequestDto> questionChoiceRequestDto,
                                @PathVariable("id") Integer idExam) {



      return  questionChoiceService.saveChoicesExam(questionChoiceRequestDto,idExam);
    }

}

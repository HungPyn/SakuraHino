package com.sakurahino.lessonservice.controller.admin;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sakurahino.lessonservice.dto.LessonQuestionResponse.LessonQuestionRequestDto;
import com.sakurahino.lessonservice.service.LessonQuestionService;
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
@RequestMapping("/admin/lesson/question")
public class LessonQuestionAdminController {
    private final LessonQuestionService lessonQuestionService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createQuestion(@RequestPart("lessonQuestion") String lessonQuestionStr,
                                                 @RequestPart("choiceImages") List<MultipartFile> choiceImages
    ) {
        LessonQuestionRequestDto requestDto;
        try {
            requestDto = objectMapper.readValue(lessonQuestionStr, LessonQuestionRequestDto.class);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dữ liệu question không hợp lệ: " + e.getMessage());
        }

        if (choiceImages != null && !choiceImages.isEmpty()) {
            for (int i = 0; i < choiceImages.size() && i < requestDto.getQuestionChoices().size(); i++) {
                requestDto.getQuestionChoices().get(i).setImageFile(choiceImages.get(i));
            }
        }

        lessonQuestionService.create(requestDto);

        return ResponseEntity.ok("Thêm quesstion thành công <3");

    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateQuestion(
            @PathVariable("id") Integer id, @RequestPart("lessonQuestion") String lessonQuestionStr,
            @RequestPart("choiceImages") List<MultipartFile> choiceImages
    ) {
        LessonQuestionRequestDto requestDto;
        try {
            requestDto = objectMapper.readValue(lessonQuestionStr, LessonQuestionRequestDto.class);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dữ liệu question không hợp lệ: " + e.getMessage());
        }

        if (choiceImages != null && !choiceImages.isEmpty()) {
            for (int i = 0; i < choiceImages.size() && i < requestDto.getQuestionChoices().size(); i++) {
                requestDto.getQuestionChoices().get(i).setImageFile(choiceImages.get(i));
            }
        }

        lessonQuestionService.update(id, requestDto);

        return ResponseEntity.ok("Cập nhật quesstion thành công <3");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteQuestion(@PathVariable("id") Integer id) {
        lessonQuestionService.delete(id);
        return ResponseEntity.ok("Xóa question thành công");
    }

}

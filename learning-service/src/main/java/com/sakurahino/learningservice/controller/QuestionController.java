package com.sakurahino.learningservice.controller;

import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.learningservice.dto.LessonQuestionRequest;
import com.sakurahino.learningservice.dto.LessonQuestionResponse;
import com.sakurahino.learningservice.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/question")
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public SuccessResponse getQuesstionsByToppicId(@RequestParam("userId") UUID userId,
                                                   @RequestParam("id") Integer toppicId) {
        System.out.println("id toppic la:--------------- " + toppicId);
        List<LessonQuestionResponse> response = questionService.getQuestionsByTopicId(userId, toppicId);
        return new SuccessResponse(response);
    }

    @GetMapping("/user/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public SuccessResponse getQuestionById(
            @PathVariable("id") Integer id) {
        LessonQuestionResponse response = questionService.getQuestionById(id);
        return new SuccessResponse(response);
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public SuccessResponse getQuesstionsByToppicIdAdmin(
            @PathVariable("id") Integer toppicId) {
        List<LessonQuestionResponse> response = questionService.getQuestionsByTopicIdAdmin(toppicId);
        return new SuccessResponse(response);
    }

    @DeleteMapping("/admin/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public SuccessResponse deleteById(
            @PathVariable("id") Integer id) {
        questionService.deleteQuestion(id);
        return new SuccessResponse("xóa câu hỏi thành công");
    }

    @PostMapping(value = "/admin/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public SuccessResponse createQuestion(
            @Valid @RequestPart("dto") LessonQuestionRequest questionRequest,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        for (int i = 0; i < files.size(); i++){
                questionRequest.getChoiceRequests().get(i).setImageFile(files.get(i));
        }
        questionService.createQuestion(questionRequest);
        return new SuccessResponse("Thêm câu hỏi thành công <3");
    }

    @PutMapping(value = "/admin/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public SuccessResponse updateQuestion(
            @PathVariable("id") Integer id,
            @Valid @RequestPart("dto") LessonQuestionRequest questionRequest,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        for (int i = 0; i < files.size(); i++){
            questionRequest.getChoiceRequests().get(i).setImageFile(files.get(i));
        }
        questionService.updateQuestion(id,questionRequest);
        return new SuccessResponse("Sửa câu hỏi thành công <3");
    }


}

package com.sakurahino.learningservice.controller.admin;

import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.learningservice.dto.question.LessonQuestionRequest;
import com.sakurahino.learningservice.service.excel.ImportExcelForQuestionService;
import com.sakurahino.learningservice.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/learning/admin/questions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class QuestionAdminController {

    private final QuestionService questionService;
    private final ImportExcelForQuestionService importExcelForQuestionService;

    @GetMapping
    public SuccessResponse getAllQuestions(
            @RequestParam("lessonId") Integer lessonId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        var response = questionService.getAllForAdmin(lessonId,page, size);

        return new SuccessResponse(response);
    }

    @GetMapping("/{lessonId}")
    public SuccessResponse getQuestionById(@PathVariable Integer lessonId) {
        var response = questionService.getQuestionById(lessonId);
        return new SuccessResponse(response);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public SuccessResponse createQuestion(
            @RequestPart("data") @Valid LessonQuestionRequest data,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {

        Map<String, MultipartFile> imageFilesMap = new HashMap<>();
        if (files != null) {
            for (int i = 0; i < files.size(); i++) {
                imageFilesMap.put("image" + (i + 1), files.get(i));
            }
        }

        var response = questionService.create(data, imageFilesMap);
        return new SuccessResponse(response);
    }

    @PutMapping(value = "/{questionId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public SuccessResponse updateQuestion(
            @PathVariable Integer questionId,
            @RequestPart("data") @Valid LessonQuestionRequest data,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {

        // Map file list sang map imageKey -> MultipartFile
        Map<String, MultipartFile> imageFilesMap = new HashMap<>();
        if (files != null) {
            for (int i = 0; i < files.size(); i++) {
                imageFilesMap.put("image" + (i + 1), files.get(i));
            }
        }

        // Gọi service update
        var response = questionService.update(questionId,data, imageFilesMap);
        return new SuccessResponse(response);
    }



    @PatchMapping("/{questionId}")
    public SuccessResponse deleteQuestionById(@PathVariable Integer questionId) {
        questionService.delete(questionId);
        return new SuccessResponse();
    }

    @PostMapping("/excel")
    public SuccessResponse importExcel(@RequestParam("file") MultipartFile file){
        importExcelForQuestionService.importExcelForQuestion(file);
        return new SuccessResponse("Thêm bằng excel thành công");
    }
}

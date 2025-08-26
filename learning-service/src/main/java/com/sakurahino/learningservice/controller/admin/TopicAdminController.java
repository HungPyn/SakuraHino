package com.sakurahino.learningservice.controller.admin;

import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.learningservice.dto.topic.TopicRequestDTO;
import com.sakurahino.learningservice.dto.topic.TopicResponseDTO;
import com.sakurahino.learningservice.service.TopicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.ZonedDateTime;

@RestController
@RequestMapping("/learning/admin/topics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class TopicAdminController {

    private final TopicService topicService;

   @GetMapping
    public SuccessResponse getAllForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        var result = topicService.getAllForAdmin(page, size);
        return new SuccessResponse(result);
    }

    @GetMapping("/{id}")
    public SuccessResponse getById(@PathVariable Integer id) {
        TopicResponseDTO topic = topicService.getById(id);
        return new SuccessResponse(topic);
    }
    @GetMapping("/filters")
    public SuccessResponse findByFilters(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String tuKhoa,
            @RequestParam(required = false) Integer levelId,
            @RequestParam(required = false) ZonedDateTime startDate,
            @RequestParam(required = false) ZonedDateTime endDate,
            @RequestParam(required = false) String status) {

        var result = topicService.findByFilters(page, size, tuKhoa, levelId, startDate, endDate, status);
        return new SuccessResponse(result);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public SuccessResponse create(
            @Valid @RequestPart("dto") TopicRequestDTO dto,
            @RequestPart("file") MultipartFile file) {
        var created = topicService.create(dto, file);
        return new SuccessResponse(created);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public SuccessResponse update(
            @PathVariable Integer id,
            @Valid @RequestPart("dto") TopicRequestDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        var updated = topicService.update(id, dto, file);
        return new SuccessResponse(updated);
    }

    @PatchMapping("/{id}")
    public SuccessResponse delete(@PathVariable Integer id) {
        topicService.delete(id);
        return new SuccessResponse("Xóa thành công");
    }
}

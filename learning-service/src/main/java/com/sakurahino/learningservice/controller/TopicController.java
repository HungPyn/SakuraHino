package com.sakurahino.learningservice.controller;

import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.learningservice.dto.TopicRequest;
import com.sakurahino.learningservice.dto.TopicResponse;
import com.sakurahino.learningservice.service.TopicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/topic")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public SuccessResponse getAllForUser(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader("X-User-Id") String userId) {
        var result = topicService.getAllForUser(page, size,userId);
        return new SuccessResponse(result);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public SuccessResponse getAllForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        var result = topicService.getAllForAdmin(page, size);
        return new SuccessResponse(result);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public SuccessResponse getById(@PathVariable Integer id) {
        TopicResponse topic = topicService.getById(id);
        return new SuccessResponse(topic);
    }

    @PostMapping(value = "/admin/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public SuccessResponse create(
            @Valid @RequestPart("dto") TopicRequest dto,
            @RequestPart("file") MultipartFile file) {
        var created = topicService.create(dto, file);
        return new SuccessResponse(created);
    }

    @PutMapping(value = "/admin/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public SuccessResponse update(
            @RequestParam Integer id,
            @Valid @RequestPart("dto") TopicRequest dto,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        var updated = topicService.update(id, dto, file);
        return new SuccessResponse(updated);
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public SuccessResponse delete(@PathVariable Integer id) {
        topicService.delete(id);
        return new SuccessResponse();
    }
}

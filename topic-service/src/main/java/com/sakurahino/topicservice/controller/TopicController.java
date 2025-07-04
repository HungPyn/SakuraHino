package com.sakurahino.topicservice.controller;

import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.topicservice.dto.TopicRequest;
import com.sakurahino.topicservice.dto.TopicResponse;
import com.sakurahino.topicservice.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/topic")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public SuccessResponse getAllForUser(
            @RequestParam(required = false) Integer levelId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        var result = topicService.getAllForUser(levelId, page, size);
        return new SuccessResponse(result);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public SuccessResponse getAllForAdmin(
            @RequestParam(required = false) Integer levelId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        var result = topicService.getAllForAdmin(levelId, page, size);
        return new SuccessResponse(result);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public SuccessResponse getById(@PathVariable String id) {
        TopicResponse topic = topicService.getById(id);
        return new SuccessResponse(topic);
    }

    @PostMapping("/admin/create")
    @PreAuthorize("hasRole('ADMIN')")
    public SuccessResponse create(
            @RequestPart("dto") TopicRequest dto,
            @RequestPart("file") MultipartFile file) {
        var created = topicService.create(dto, file);
        return new SuccessResponse(created);
    }

    @PutMapping("/admin/update")
    @PreAuthorize("hasRole('ADMIN')")
    public SuccessResponse update(
            @RequestParam String id,
            @RequestPart("dto") TopicRequest dto,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        var updated = topicService.update(id, dto, file);
        return new SuccessResponse(updated);
    }

    @DeleteMapping("admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public SuccessResponse delete(@PathVariable String id) {
        topicService.delete(id);
        return new SuccessResponse();
    }
}

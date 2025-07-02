package com.sakurahino.uploadservice.controller;

import com.sakurahino.common.ex.ResourceException;
import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.uploadservice.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class UploadController {

    private final UploadService uploadService;

    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "image/jpeg", "image/png", "audio/mpeg"
    );

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    /**
     * Upload ảnh hoặc file mp3
     */
    @PostMapping("/upload")
    public SuccessResponse uploadFile(@RequestParam("file") MultipartFile file) {
        validateFile(file);
        String url = uploadService.uploadAvoidDuplicate(file);
        return new SuccessResponse(new UploadResponse(url));
    }

    /**
     * Text to Speech (Google TTS) -> sinh audio và upload
     */
    @PostMapping("/tts")
    public SuccessResponse synthesizeAndUpload(@RequestParam("text") String text) {
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Text is required for synthesis");
        }
        String url = uploadService.synthesizeAndUpload(text);
        return new SuccessResponse(new UploadResponse(url));
    }

    /**
     * Xóa file theo objectName (vd: tts/abc123.mp3)
     */
    @DeleteMapping("/{objectName}")
    public SuccessResponse deleteFile(@PathVariable String objectName) {
        boolean deleted = uploadService.deleteFile(objectName);
        if (!deleted) {
            throw new ResourceException(404, "File not found or already deleted: " + objectName);
        }
        return new SuccessResponse("File deleted successfully");
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Unsupported file type: " + file.getContentType());
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 5MB limit");
        }
    }

    private record UploadResponse(String url) {}
}

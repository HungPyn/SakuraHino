package com.sakurahino.uploadservice.controller;

import com.sakurahino.clients.dto.AudioUploadResponseDTO;
import com.sakurahino.clients.dto.UploadExcelFileResponse;
import com.sakurahino.clients.dto.UploadResponse;
import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.ex.ResourceException;
import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.uploadservice.service.UploadService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.HandlerMapping;

import java.util.List;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Slf4j
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
    public ResponseEntity<?> uploadFile(@RequestPart("file") MultipartFile file) {
        validateFile(file);
        String url = uploadService.uploadAvoidDuplicate(file);
        return ResponseEntity.ok(new UploadResponse(url));
    }

    /**
     * Upload file excel
     */
    @PostMapping("/excel")
    public ResponseEntity<?> uploadExcel(@RequestPart("file") MultipartFile file) {
        validateExcel(file);
        String url = uploadService.uploadAvoidDuplicate(file);
        return ResponseEntity.ok(new UploadExcelFileResponse(url));
    }

    private void validateExcel(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ExceptionCode.FILE_NOT_NULL);
        }
        if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                .equals(file.getContentType())) {
            throw new AppException(ExceptionCode.FILE_NOT_SUPPORT);
        }
        if (file.getSize() > (100 * 1024 * 1024)) {
            throw new AppException(ExceptionCode.FILE_MAX);
        }
    }

    /**
     * Text to Speech (Google TTS) -> sinh audio và upload
     */
    @PostMapping("/tts")
    public ResponseEntity<?> synthesizeAndUpload(@RequestParam("text") String text) {
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Text is required for synthesis");
        }
        String url = uploadService.synthesizeAndUpload(text);
        return ResponseEntity.ok(new AudioUploadResponseDTO(url));
    }

    /**
     * Xóa file bất kỳ theo objectName (vd: uploads/abc123.png)
     */
    @DeleteMapping("/**")
    public ResponseEntity<Void> deleteFile(HttpServletRequest request) {
        log.info("Bắt đầu xóa ảnh {}", request.getRequestURI());
        // Lấy toàn bộ path sau /api/v1/files/
        String path = (String) request.getAttribute(
                HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String bestMatchPattern = (String) request.getAttribute(
                HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        String objectName = new AntPathMatcher().extractPathWithinPattern(bestMatchPattern, path);

        if (objectName == null || objectName.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        uploadService.deleteFile(objectName);
        log.info("Xóa ảnh thành công: {}", objectName);
        return ResponseEntity.ok().build();
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ExceptionCode.FILE_NOT_NULL);
        }
        System.out.println("File content type: " + file.getContentType());
        System.out.println("File size: " + file.getSize());
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new AppException(ExceptionCode.FILE_NOT_SUPPORT);
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new AppException(ExceptionCode.FILE_MAX);
        }
    }

}

package com.sakurahino.uploadservice.service.impl;

import com.sakurahino.uploadservice.service.StorageService;
import com.sakurahino.uploadservice.service.TextToSpeechService;
import com.sakurahino.uploadservice.service.UploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class UploadServiceImpl implements UploadService {

    private final StorageService storageService;
    private final TextToSpeechService textToSpeechService;

    @Override
    public String uploadAvoidDuplicate(MultipartFile file) {
        try {
            // Tạo hash theo nội dung file
            String hash = generateFileHash(file);
            String extension = getExtension(file.getOriginalFilename());
            String objectName = "uploads/" + hash + extension;

            // Nếu đã có URL (signed URL không null), coi như đã tồn tại
            try {
                storageService.generateSignedUrl(objectName, 1, java.util.concurrent.TimeUnit.MINUTES);
                return storageService.getPublicFileUrl(objectName); // đã tồn tại
            } catch (Exception ignored) {
                // Không tồn tại, tiếp tục upload
            }

            return storageService.upload(file, objectName);
        } catch (IOException e) {
            throw new RuntimeException("Upload failed", e);
        }
    }

    @Override
    public String synthesizeAndUpload(String text) {
        try {
            return textToSpeechService.synthesizeAndUpload(text);
        } catch (Exception e) {
            throw new RuntimeException("TTS failed", e);
        }
    }

    @Override
    public boolean deleteFile(String objectName) {
        return storageService.delete(objectName);
    }

    private String generateFileHash(MultipartFile file) throws IOException {
        byte[] bytes = file.getBytes();
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(bytes);
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not supported", e);
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.'));
    }
}

package com.sakurahino.uploadservice.service;

import org.springframework.web.multipart.MultipartFile;

public interface UploadService {
    String uploadAvoidDuplicate(MultipartFile file);
    String synthesizeAndUpload(String text);
    boolean deleteFile(String objectName);

}

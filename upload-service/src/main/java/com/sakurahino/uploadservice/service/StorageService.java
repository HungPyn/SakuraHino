package com.sakurahino.uploadservice.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.concurrent.TimeUnit;

public interface StorageService {

    String upload(InputStream inputStream, String objectName, String contentType) throws IOException;

    String upload(MultipartFile file, String objectName) throws IOException;

    String getPublicFileUrl(String objectName);

    URL generateSignedUrl(String objectName, long duration, TimeUnit timeUnit);

    boolean delete(String objectName);
}


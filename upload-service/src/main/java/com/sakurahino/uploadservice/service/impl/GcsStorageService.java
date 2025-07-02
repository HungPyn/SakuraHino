package com.sakurahino.uploadservice.service.impl;

import com.google.cloud.storage.*;
import com.sakurahino.uploadservice.service.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class GcsStorageService implements StorageService {

    private final Storage storage;

    @Value("${gcp.storage.bucket-name}")
    private String bucketName;

    @Override
    public String upload(InputStream inputStream, String objectName, String contentType) throws IOException {
        BlobId blobId = BlobId.of(bucketName, objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(contentType).build();
        storage.create(blobInfo, inputStream);
        return getPublicFileUrl(objectName);
    }

    @Override
    public String upload(MultipartFile file, String objectName) throws IOException {
        try (InputStream inputStream = file.getInputStream()) {
            return upload(inputStream, objectName, file.getContentType());
        }
    }

    @Override
    public String getPublicFileUrl(String objectName) {
        return String.format("https://storage.googleapis.com/%s/%s", bucketName, objectName);
    }

    @Override
    public URL generateSignedUrl(String objectName, long duration, TimeUnit timeUnit) {
        BlobId blobId = BlobId.of(bucketName, objectName);
        BlobInfo blobInfo = storage.get(blobId);
        if (blobInfo == null) {
            throw new StorageException(404, "File not found: " + objectName);
        }

        return storage.signUrl(blobInfo, duration, timeUnit,
                Storage.SignUrlOption.httpMethod(HttpMethod.GET),
                Storage.SignUrlOption.withV4Signature());
    }

    @Override
    public boolean delete(String objectName) {
        return storage.delete(BlobId.of(bucketName, objectName));
    }
}

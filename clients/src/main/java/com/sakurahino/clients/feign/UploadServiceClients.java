package com.sakurahino.clients.feign;

import com.sakurahino.clients.dto.UploadResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "upload-service")
public interface UploadServiceClients {

    @PostMapping(value = "/api/v1/files/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    UploadResponse uploadFile(@RequestPart("file") MultipartFile file);

    @DeleteMapping("/api/v1/files/{objectName}")
    void deleteFile(@PathVariable("objectName") String objectName);

}

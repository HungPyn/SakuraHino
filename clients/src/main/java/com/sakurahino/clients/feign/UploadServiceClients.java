package com.sakurahino.clients.feign;

import com.sakurahino.clients.config.FeignMultipartSupportConfig;
import com.sakurahino.clients.dto.UploadResponse;
import com.sakurahino.common.retresponse.SuccessResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

@FeignClient(
        name = "upload-service",
        configuration = FeignMultipartSupportConfig.class
)
public interface UploadServiceClients {

    @PostMapping(value = "/api/v1/files/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    UploadResponse uploadFile(@RequestPart("file") MultipartFile file);

    @DeleteMapping("/api/v1/files/{objectName}")
    void deleteFile(@PathVariable("objectName") String objectName);

    // audio
    @PostMapping("/api/v1/files/tts")
    UploadResponse upLoadText(@RequestParam("text") String text);
}

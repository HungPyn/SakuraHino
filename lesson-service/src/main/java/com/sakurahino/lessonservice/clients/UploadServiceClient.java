package com.sakurahino.lessonservice.clients;

import com.sakurahino.common.retresponse.SuccessResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "upload-service")
public interface UploadServiceClient {
    @PostMapping("/api/v1/files/tts")
    SuccessResponse textToSpeech(@RequestParam("text") String text);
}

package com.sakurahino.lessonservice.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "toppic-service")
public interface ToppicServiceClient {
    @GetMapping("/admin/toppic/getToppicForLesson/{id}")
    boolean isToppic(@PathVariable("id") Integer id);
}

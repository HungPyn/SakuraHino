package com.sakurahino.topicservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication(scanBasePackages = {
        "com.sakurahino.topicservice",
        "com.sakurahino.common",
        "com.sakurahino.clients.feign"
})
@EnableFeignClients(basePackages = "com.sakurahino.clients.feign")
public class TopicServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(TopicServiceApplication.class, args);
    }

}

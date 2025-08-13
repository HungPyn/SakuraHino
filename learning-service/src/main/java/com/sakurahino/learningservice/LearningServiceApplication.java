package com.sakurahino.learningservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication(scanBasePackages = {
        "com.sakurahino.learningservice",
        "com.sakurahino.common",
        "com.sakurahino.clients.feign",
        "com.sakurahino.ampqclient"
})
@EnableFeignClients(basePackages = "com.sakurahino.clients.feign")
public class LearningServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(LearningServiceApplication.class, args);
    }

}

package com.sakurahino.userservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {
        "com.sakurahino.userservice",
        "com.sakurahino.ampqclient",
        "com.sakurahino.common"
})
@EnableScheduling
@EnableFeignClients(basePackages = "com.sakurahino.clients.feign")
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }

}

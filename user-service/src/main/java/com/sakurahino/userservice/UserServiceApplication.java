package com.sakurahino.userservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication(scanBasePackages = {
        "com.sakurahino.userservice",
        "com.sakurahino.ampqclient",
        "com.sakurahino.common"
})
@EnableFeignClients(basePackages = "com.sakurahino.clients.feign")
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }

}

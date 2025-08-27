package com.sakurahino.aphabetservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication(scanBasePackages = {
        "com.sakurahino.aphabetservice",
        "com.sakurahino.common",
        "com.sakurahino.clients.feign",
        "com.sakurahino.ampqclient"
})
@EnableFeignClients(basePackages = "com.sakurahino.clients.feign")
public class AphabetServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AphabetServiceApplication.class, args);
    }

}

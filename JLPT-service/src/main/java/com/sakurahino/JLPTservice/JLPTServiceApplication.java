package com.sakurahino.JLPTservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication(scanBasePackages = {
        "com.sakurahino.JLPTservice",
        "com.sakurahino.common",
        "com.sakurahino.clients.feign",
        "com.sakurahino.ampqclient"
})
public class JLPTServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(JLPTServiceApplication.class, args);
    }

}

package com.sakurahino.uploadservice.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class GcsStorageConfig {

    @Value("${spring.cloud.gcp.credentials.location}")
    private String credentialsLocation;

    @Value("${spring.cloud.gcp.project-id}")
    private String projectId;

    @Bean
    public Storage storage() throws IOException {
        // Loại bỏ tiền tố "file:" nếu có
        String path = credentialsLocation.replaceFirst("^file:(//)?", "");
        GoogleCredentials credentials = GoogleCredentials.fromStream(new FileInputStream(path));

        return StorageOptions.newBuilder()
                .setCredentials(credentials)
                .setProjectId(projectId) // <- Thêm dòng này
                .build()
                .getService();
    }
}

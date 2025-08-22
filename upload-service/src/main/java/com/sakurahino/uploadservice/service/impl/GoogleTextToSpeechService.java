package com.sakurahino.uploadservice.service.impl;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.texttospeech.v1.*;
import com.google.protobuf.ByteString;
import com.sakurahino.uploadservice.service.StorageService;
import com.sakurahino.uploadservice.service.TextToSpeechService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleTextToSpeechService implements TextToSpeechService {

    private final StorageService storageService;

    @Value("${spring.cloud.gcp.credentials.location}")
    private String credentialsPath; // Spring sẽ inject đường dẫn từ yml

    @Override
    public String synthesizeAndUpload(String text) throws Exception {
        System.out.println("text ở service gg: " + text);
        String hash = generateHash(text);
        String objectName = "tts/" + hash + ".mp3";

        boolean exists;
        try {
            storageService.generateSignedUrl(objectName, 1, java.util.concurrent.TimeUnit.MINUTES);
            exists = true;
        } catch (com.google.cloud.storage.StorageException e) {
            if (e.getCode() == 404) exists = false;
            else throw e;
        }

        if (exists) {
            return storageService.getPublicFileUrl(objectName);
        }

        System.out.println("object ở service gg: " + objectName);

        // Tạo credentials từ Spring Cloud GCP yml
        GoogleCredentials credentials = GoogleCredentials.fromStream(
                Objects.requireNonNull(getClass().getClassLoader().getResourceAsStream(
                        credentialsPath.replace("classpath:", "")
                ))
        );

        TextToSpeechSettings settings = TextToSpeechSettings.newBuilder()
                .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                .build();

        try (TextToSpeechClient client = TextToSpeechClient.create(settings)) {
            SynthesisInput input = SynthesisInput.newBuilder().setText(text).build();

            VoiceSelectionParams voice = VoiceSelectionParams.newBuilder()
                    .setLanguageCode("ja-JP")
                    .setSsmlGender(SsmlVoiceGender.NEUTRAL)
                    .build();

            AudioConfig audioConfig = AudioConfig.newBuilder()
                    .setAudioEncoding(AudioEncoding.MP3)
                    .build();

            SynthesizeSpeechResponse response = client.synthesizeSpeech(input, voice, audioConfig);
            ByteString audioContents = response.getAudioContent();

            return storageService.upload(
                    new ByteArrayInputStream(audioContents.toByteArray()),
                    objectName,
                    "audio/mp3"
            );
        }
    }

    private String generateHash(String text) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(text.getBytes(StandardCharsets.UTF_8));
        return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
    }
}

package com.sakurahino.uploadservice.service.impl;

import com.google.cloud.texttospeech.v1.*;
import com.google.protobuf.ByteString;
import com.sakurahino.uploadservice.service.StorageService;
import com.sakurahino.uploadservice.service.TextToSpeechService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleTextToSpeechService implements TextToSpeechService {

    private final StorageService storageService;

    @Override
    public String synthesizeAndUpload(String text) throws Exception {
        System.out.println("text ở service gg: "+text);
        String hash = generateHash(text);
        String objectName = "tts/" + hash + ".mp3";

        // Nếu đã có file rồi => trả về URL luôn
        if (storageService.generateSignedUrl(objectName, 1, java.util.concurrent.TimeUnit.MINUTES) != null) {
            return storageService.getPublicFileUrl(objectName);
        }
        System.out.println("obejct ở service gg: "+objectName);
        try (TextToSpeechClient client = TextToSpeechClient.create()) {
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

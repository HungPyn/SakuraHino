package com.sakurahino.uploadservice.service;

public interface TextToSpeechService {
    String synthesizeAndUpload(String text) throws Exception;
}

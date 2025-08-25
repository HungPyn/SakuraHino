package com.sakurahino.learningservice.service.impl;

import com.sakurahino.clients.dto.UploadResponse;
import com.sakurahino.clients.feign.UploadServiceClients;
import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.learningservice.dto.questionchoice.QuestionChoiceRequest;
import com.sakurahino.learningservice.entity.LessonQuestion;
import com.sakurahino.learningservice.entity.QuestionChoice;
import com.sakurahino.learningservice.enums.QuestionType;
import com.sakurahino.learningservice.repository.QuestionChoiceRepository;
import com.sakurahino.learningservice.utils.servicehelper.AudioService;
import com.sakurahino.learningservice.service.QuestionChoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class QuestionChoiceServiceImpl implements QuestionChoiceService {

    private final QuestionChoiceRepository questionChoiceRepository;
    private final UploadServiceClients uploadServiceClients;
    private final AudioService audioService; // <-- inject AudioService

    @Override
    public void addQuestionChoice(LessonQuestion lessonQuestion,
                                  List<QuestionChoiceRequest> choiceRequests,
                                  Map<String, MultipartFile> imageFilesMap) {
        switch (lessonQuestion.getQuestionType()) {
            case MULTIPLE_CHOICE_TEXT_ONLY:
            case  AUDIO_CHOICE:
            case MULTIPLE_CHOICE_VOCAB_IMAGE:
                choiceRequests.forEach(cr -> addChoice(lessonQuestion, cr, imageFilesMap));
                break;

            case WORD_ORDER:
            case PRONUNCIATION:
            case WRITING:
                if (!choiceRequests.isEmpty()) {
                    addChoice(lessonQuestion, choiceRequests.get(0), imageFilesMap);
                }
                break;

            default:
                throw new UnsupportedOperationException(
                        "Type question chưa được hỗ trợ: " + lessonQuestion.getQuestionType()
                );
        }
    }

    @Override
    public void updateQuestionChoice(Integer questionChoiceId,
                                     QuestionChoiceRequest req,
                                     Map<String, MultipartFile> imageFilesMap) {
        boolean updated = false;
        QuestionChoice qc = questionChoiceRepository.findById(questionChoiceId)
                .orElseThrow(() -> new AppException(ExceptionCode.CHOICE_NOT_FOUND));
        // Text Romaji
        if (!Objects.equals(req.getTextRomaji(), qc.getTextRomaji())) {
            qc.setTextRomaji(req.getTextRomaji());
            updated = true;
        }

        // Text Foreign + Audio
        if (!Objects.equals(req.getTextForeign(), qc.getTextForeign())) {
            qc.setTextForeign(req.getTextForeign());
            qc.setAudioUrlForeign(
                    audioService.getOrUploadAudio(qc.getLessonQuestion(), qc, req.getTextForeign())
            );
            updated = true;
        }

        // Meaning
        if (!Objects.equals(req.getMeaning(), qc.getMeaning())) {
            qc.setMeaning(req.getMeaning());
            updated = true;
        }

        // IsCorrect
        if (!Objects.equals(req.getIsCorrect(), qc.getIsCorrect())) {
            qc.setIsCorrect(req.getIsCorrect());
            updated = true;
        }

        // Image (chỉ update nếu có multipart file mới)
        if (req.getImageKey() != null && imageFilesMap != null) {
            MultipartFile file = imageFilesMap.get(req.getImageKey());
            if (file != null && !file.isEmpty()) {
                String newUrl = uploadImage(file);
                if (!Objects.equals(newUrl, qc.getImageUrl())) {
                    // Nếu cần có thể xoá ảnh cũ ở đây qua uploadServiceClients.deleteFile(...)
                    qc.setImageUrl(newUrl);
                    updated = true;
                }
            }
        }

        // Lưu lại nếu có thay đổi
        if (updated) {
            questionChoiceRepository.save(qc);
        }
    }

    private void addChoice(LessonQuestion question,
                           QuestionChoiceRequest cr,
                           Map<String, MultipartFile> imageFilesMap) {

        QuestionChoice qc = new QuestionChoice();
        qc.setLessonQuestion(question);
        qc.setTextRomaji(cr.getTextRomaji());
        qc.setTextForeign(cr.getTextForeign());
        qc.setIsCorrect(cr.getIsCorrect());
        qc.setMeaning(cr.getMeaning());

        QuestionType type = question.getQuestionType();

        // Hình ảnh cho MULTIPLE_CHOICE_VOCAB_IMAGE
        if (type == QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE && cr.getImageKey() != null) {
            MultipartFile file = imageFilesMap.get(cr.getImageKey());
            if (file != null) {
                qc.setImageUrl(uploadImage(file)); // upload file → trả về URL
            }
        }

        // Audio xử lý theo loại câu hỏi → dùng AudioService
        switch (type) {
            case MULTIPLE_CHOICE_TEXT_ONLY:
            case WORD_ORDER:
                qc.setAudioUrlForeign(audioService.getOrUploadAudio(question, qc, cr.getTextForeign()));
                break;

            case AUDIO_CHOICE:
            case MULTIPLE_CHOICE_VOCAB_IMAGE:
                if (Boolean.TRUE.equals(cr.getIsCorrect())) {
                    qc.setAudioUrlForeign(audioService.getOrUploadAudio(question, qc, cr.getTextForeign()));
                }
                break;

            default:
                break;
        }

        // Thêm choice vào LessonQuestion để map response đầy đủ
        question.getChoices().add(qc);

        // Lưu choice
        questionChoiceRepository.save(qc);
    }

    private String uploadImage(MultipartFile file) {
        UploadResponse response = uploadServiceClients.uploadFile(file);
        return response.getUrlImage();
    }
}


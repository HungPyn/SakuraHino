package com.example.examservice.service.impl;

import com.example.examservice.dto.choiceExam.ChoiceRequestCreateDto;
import com.example.examservice.dto.choiceExam.QuestionChoiceRequestDto;
import com.example.examservice.dto.choiceExam.QuestionChoiceResponseDto;
import com.example.examservice.entity.ExamQuestion;
import com.example.examservice.entity.QuestionChoice;
import com.example.examservice.entity.enums.QuestionType;
import com.example.examservice.repositories.ExamQuestionRepository;
import com.example.examservice.repositories.QuestionChoiceRepository;
import com.example.examservice.service.GcsStorageService;
import com.example.examservice.service.QuestionChoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionChoiceServiceImpl implements QuestionChoiceService {
    private final QuestionChoiceRepository questionChoiceRepository;
    private final GcsStorageService gcsStorageService;
    private final ExamQuestionRepository examQuestionRepository;

    @Override
    public List<QuestionChoiceResponseDto> getChoicesByIdExamQuestion(Integer idExam) {
        List<QuestionChoice> questionChoices = questionChoiceRepository.findQuestionChoicesByExamQuestionId(idExam);
        List<QuestionChoiceResponseDto> responseDtos = questionChoices.stream().map(questionChoice ->
                QuestionChoiceResponseDto.builder()
                        .id(questionChoice.getId())
                        .examQuestionId(questionChoice.getExamQuestion().getId())
                        .textForeign(questionChoice.getTextForeign())
                        .textRomaji(questionChoice.getTextRomaji())
                        .imageUrl(questionChoice.getImageUrl())
                        .audioUrlForeign(questionChoice.getAudioUrlForeign())
                        .isCorrect(questionChoice.getIsCorrect())
                        .textBlock(questionChoice.getTextBlock())
                        .meaning(questionChoice.getMeaning())
                        .build()
        ).collect(Collectors.toList());

        return responseDtos;
    }

    @Override
    public void deleteChoice(Integer id) {
        Optional<QuestionChoice> questionChoiceOptional = questionChoiceRepository.findById(id);
        if (questionChoiceOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Đáp án này không tồn tại id: " + id);
        }
        QuestionChoice choice = questionChoiceOptional.get();

        // Xóa ảnh trên GCS nếu có
        String imageUrl = choice.getImageUrl();
        if (imageUrl != null && !imageUrl.isBlank()) {
            String objectName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            try {
                gcsStorageService.deleteFile(objectName);
            } catch (Exception e) {
                System.err.println("Không thể xóa ảnh trên GCS: " + objectName);
            }
        }
        questionChoiceRepository.delete(choice);
    }

    @Override
    public QuestionChoiceResponseDto create(ChoiceRequestCreateDto choiceRequestCreateDto, MultipartFile avatarChoice) {
        ExamQuestion exam = examQuestionRepository.findById(choiceRequestCreateDto.getExamQuestionId()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "exam không tồn tại"));
        QuestionChoice questionChoice = new QuestionChoice();

        questionChoice.setExamQuestion(exam);
        questionChoice.setTextForeign(choiceRequestCreateDto.getTextForeign());
        questionChoice.setTextRomaji(choiceRequestCreateDto.getTextRomaji());
        questionChoice.setAudioUrlForeign(choiceRequestCreateDto.getAudioUrlForeign());
        questionChoice.setIsCorrect(choiceRequestCreateDto.getIsCorrect());
        questionChoice.setTextBlock(choiceRequestCreateDto.getTextBlock());
        questionChoice.setMeaning(choiceRequestCreateDto.getMeaning());

        // Xử lý ảnh

        if ((avatarChoice == null || avatarChoice.isEmpty())
                && exam.getQuestionType() == QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chưa thêm file ảnh cho câu hỏi dạng hình ảnh");
        }

        if(avatarChoice != null && !avatarChoice.isEmpty()){

            String originalFilename = avatarChoice.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String objectName = UUID.randomUUID().toString() + fileExtension;

            try {
                // Upload file mới
                gcsStorageService.uploadFileToPublicBucket(avatarChoice, objectName);

            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Tải ảnh không thành công" + e);
            }
            String publicUrl = gcsStorageService.getPublicFileUrl(objectName);
            questionChoice.setImageUrl(publicUrl);
        }

        if ((questionChoice.getTextBlock() == null || questionChoice.getTextBlock().isEmpty())
                && exam.getQuestionType() == QuestionType.WORD_ORDER) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chưa thêm đáp án cho câu xắp xếp");
        }
        if ((questionChoice.getImageUrl() == null || questionChoice.getImageUrl().isEmpty())
                && exam.getQuestionType() == QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chưa thêm ảnh cho câu hình ảnh");
        }


        questionChoiceRepository.save(questionChoice);
        QuestionChoiceResponseDto responseDto = QuestionChoiceResponseDto.builder()
                .id(questionChoice.getId())
                .examQuestionId(questionChoice.getExamQuestion() != null ? questionChoice.getExamQuestion().getId() : null)
                .textForeign(questionChoice.getTextForeign())
                .textRomaji(questionChoice.getTextRomaji())
                .imageUrl(questionChoice.getImageUrl())
                .audioUrlForeign(questionChoice.getAudioUrlForeign())
                .isCorrect(questionChoice.getIsCorrect())
                .textBlock(questionChoice.getTextBlock())
                .meaning(questionChoice.getMeaning())
                .build();
        return responseDto;
    }

    @Override
    public boolean saveChoices(List<QuestionChoiceRequestDto> questionChoiceRequestDto, Integer idExam) {
        ExamQuestion examQuestion = examQuestionRepository.findById(idExam)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "exam question không tồn tại với id: " + idExam));

        List<QuestionChoice> choicesToSave = new ArrayList<>();

        for (QuestionChoiceRequestDto requestDto : questionChoiceRequestDto) {
            QuestionChoice questionChoice;
            if (requestDto.getId() != null) {
                questionChoice = questionChoiceRepository.findById(requestDto.getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Choice không tồn tại với id: " + requestDto.getId()));

                if (!examQuestion.equals(questionChoice.getExamQuestion())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choice id " + requestDto.getId() + " không thuộc về exam id " + idExam);
                }

                MultipartFile imageFile = requestDto.getImageFile();
                if (imageFile != null && !imageFile.isEmpty()) {
                    String oldImageUrl = questionChoice.getImageUrl();
                    if (oldImageUrl != null && !oldImageUrl.isBlank()) {
                        String oldObjectName = oldImageUrl.substring(oldImageUrl.lastIndexOf("/") + 1);
                        try {
                            gcsStorageService.deleteFile(oldObjectName);
                        } catch (Exception e) {
                            System.err.println("Cảnh báo: Không thể xóa ảnh cũ trên GCS: " + oldObjectName + ". Lỗi: " + e.getMessage());
                        }
                    }
                }
            } else {
                // Tạo mới choice
                questionChoice = new QuestionChoice();
            }
            questionChoice.setExamQuestion(examQuestion);
            questionChoice.setTextForeign(requestDto.getTextForeign());
            questionChoice.setTextRomaji(requestDto.getTextRomaji());
            questionChoice.setIsCorrect(requestDto.getIsCorrect());
            questionChoice.setTextBlock(requestDto.getTextBlock());
            questionChoice.setMeaning(requestDto.getMeaning());
            if ((questionChoice.getTextBlock() == null || questionChoice.getTextBlock().isEmpty())
                    && examQuestion.getQuestionType() == QuestionType.WORD_ORDER) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chưa thêm đáp án cho câu xắp xếp");
            }
            if ((questionChoice.getImageUrl() == null || questionChoice.getImageUrl().isEmpty())
                    && examQuestion.getQuestionType() == QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chưa thêm ảnh cho câu hình ảnh");
            }

            questionChoice.setAudioUrlForeign(requestDto.getAudioUrlForeign()); // Cập nhật audio URL nếu có

            MultipartFile imageFile = requestDto.getImageFile();
            if (imageFile != null && !imageFile.isEmpty()) {
                String originalFilename = imageFile.getOriginalFilename();
                String fileExtension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String objectName = UUID.randomUUID() + fileExtension;
                try {
                    gcsStorageService.uploadFileToPublicBucket(imageFile, objectName);
                } catch (IOException e) {
                    throw new RuntimeException("Tải ảnh lên thất bại cho choice: " + requestDto.getId() + ". Lỗi: " + e.getMessage(), e);
                }
                String publicUrl = gcsStorageService.getPublicFileUrl(objectName);
                questionChoice.setImageUrl(publicUrl);
            } else if (requestDto.getId() != null && requestDto.getImageFile() == null) {
                String oldImageUrl = questionChoice.getImageUrl();
                if (oldImageUrl != null && !oldImageUrl.isBlank()) {
                    String oldObjectName = oldImageUrl.substring(oldImageUrl.lastIndexOf("/") + 1);
                    try {
                        gcsStorageService.deleteFile(oldObjectName);
                        questionChoice.setImageUrl(null);
                    } catch (Exception e) {
                        System.err.println("Cảnh báo: Không thể xóa ảnh cũ khi cập nhật choice: " + oldObjectName + ". Lỗi: " + e.getMessage());
                    }
                }
            }


            choicesToSave.add(questionChoice);
        }
        if (examQuestion.getQuestionType() == QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE) {
            for (QuestionChoice choice : choicesToSave) {
                boolean chuaCoAnhMoi = (choice.getImageUrl() == null || choice.getImageUrl().isEmpty());

                if (chuaCoAnhMoi) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui lòng chọn lại đủ ảnh cho các lựa chọn");
                }
            }
        }

        questionChoiceRepository.saveAll(choicesToSave);
        return true;
    }
}

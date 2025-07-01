package com.sakurahino.lessonservice.service.impl;

import com.sakurahino.lessonservice.dto.questionChoice.ChoiceRequestCreateDto;
import com.sakurahino.lessonservice.dto.questionChoice.QuestionChoiceRequestDto;
import com.sakurahino.lessonservice.dto.questionChoice.QuestionChoiceResponseDto;
import com.sakurahino.lessonservice.entity.LessonQuestion;
import com.sakurahino.lessonservice.entity.QuestionChoice;
import com.sakurahino.lessonservice.entity.enums.QuestionType;
import com.sakurahino.lessonservice.repository.LessonQuestionRepository;
import com.sakurahino.lessonservice.repository.QuestionChoiceRepository;
import com.sakurahino.lessonservice.service.GcsStorageService;
import com.sakurahino.lessonservice.service.QuestionChoiceService;
import jakarta.transaction.Transactional;
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

    private final LessonQuestionRepository lessonQuestionRepository;

    private final GcsStorageService gcsStorageService;


    @Override
    public List<QuestionChoiceResponseDto> getAllChoiceByIdLessonQuestion(Integer lessonQuestionId) {
        List<QuestionChoice> questionChoices = questionChoiceRepository.findByLessonQuestion_Id(lessonQuestionId);
        List<QuestionChoiceResponseDto> responseDtos = questionChoices.stream().map(questionChoice ->
                QuestionChoiceResponseDto.builder()
                        .id(questionChoice.getId())
                        .lessonQuestionId(questionChoice.getLessonQuestion().getId())
                        .examQuestionId(questionChoice.getExamQuestionId())
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
    @Transactional
    public boolean saveChoices(List<QuestionChoiceRequestDto> questionChoiceRequestDtos, Integer idQuestion) {
        LessonQuestion lessonQuestion = lessonQuestionRepository.findById(idQuestion)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "LessonQuestion không tồn tại với id: " + idQuestion));

        List<QuestionChoice> choicesToSave = new ArrayList<>();

        for (QuestionChoiceRequestDto requestDto : questionChoiceRequestDtos) {
            QuestionChoice questionChoice;
            if (requestDto.getId() != null) {
                questionChoice = questionChoiceRepository.findById(requestDto.getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Choice không tồn tại với id: " + requestDto.getId()));

                if (!lessonQuestion.equals(questionChoice.getLessonQuestion())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choice id " + requestDto.getId() + " không thuộc về LessonQuestion id " + idQuestion);
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
            questionChoice.setLessonQuestion(lessonQuestion);
            questionChoice.setExamQuestionId(null);
            questionChoice.setTextForeign(requestDto.getTextForeign());
            questionChoice.setTextRomaji(requestDto.getTextRomaji());
            questionChoice.setIsCorrect(requestDto.getIsCorrect());
            questionChoice.setTextBlock(requestDto.getTextBlock());
            questionChoice.setMeaning(requestDto.getMeaning());

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
        if (lessonQuestion.getQuestionType() == QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE) {
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


    @Override
    public QuestionChoiceResponseDto create(ChoiceRequestCreateDto choiceRequestCreateDto, MultipartFile avatarChoice) {
        LessonQuestion question = lessonQuestionRepository.findById(choiceRequestCreateDto.getLessonQuestionId()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Question không tồn tại"));
        QuestionChoice questionChoice = new QuestionChoice();

        questionChoice.setLessonQuestion(question);
        questionChoice.setExamQuestionId(choiceRequestCreateDto.getExamQuestionId());
        questionChoice.setTextForeign(choiceRequestCreateDto.getTextForeign());
        questionChoice.setTextRomaji(choiceRequestCreateDto.getTextRomaji());
        questionChoice.setAudioUrlForeign(choiceRequestCreateDto.getAudioUrlForeign());
        questionChoice.setIsCorrect(choiceRequestCreateDto.getIsCorrect());
        questionChoice.setTextBlock(choiceRequestCreateDto.getTextBlock());
        questionChoice.setMeaning(choiceRequestCreateDto.getMeaning());

        // Xử lý ảnh

        if ((avatarChoice == null || avatarChoice.isEmpty())
                && question.getQuestionType() == QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE) {
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


        questionChoiceRepository.save(questionChoice);
         QuestionChoiceResponseDto responseDto = QuestionChoiceResponseDto.builder()
                .id(questionChoice.getId())
                .lessonQuestionId(questionChoice.getLessonQuestion() != null ? questionChoice.getLessonQuestion().getId() : null)
                .examQuestionId(questionChoice.getExamQuestionId())
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


    //cho exam
    @Override
    public List<QuestionChoiceResponseDto> getAllChoiceByExamId(Integer examId) {
        List<QuestionChoice> questionChoices = questionChoiceRepository.findQuestionChoicesByExamQuestionId(examId);
        List<QuestionChoiceResponseDto> responseDtos = questionChoices.stream().map(questionChoice ->
                QuestionChoiceResponseDto.builder()
                        .id(questionChoice.getId())
                        .lessonQuestionId(questionChoice.getLessonQuestion().getId())
                        .examQuestionId(questionChoice.getExamQuestionId())
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
    @Transactional
    public boolean deleteChoiceByExamId(Integer examId) {
      if(examId == null){
          throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Chưa truyền examId");
      }
        List<QuestionChoice> existingChoices = questionChoiceRepository.findQuestionChoicesByExamQuestionId(examId);
        if (existingChoices.isEmpty()) {
            return false;
        }
        questionChoiceRepository.deleteQuestionChoicesByExamQuestionId(examId);
        List<QuestionChoice> remainingChoices = questionChoiceRepository.findQuestionChoicesByExamQuestionId(examId);

        return remainingChoices.isEmpty();
    }

    @Override
    public boolean saveChoicesExam(List<QuestionChoiceRequestDto> questionChoiceRequestDtos,Integer idExamQuestion) {

        //bổ sung tìm lại toppic xem phải không trước khi thêm hoặc sửa----------------------------------------------------
//        LessonQuestion lessonQuestion = lessonQuestionRepository.findById(idQuestion)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "LessonQuestion không tồn tại với id: " + idQuestion));

        List<QuestionChoice> choicesToSave = new ArrayList<>();

        for (QuestionChoiceRequestDto requestDto : questionChoiceRequestDtos) {
            QuestionChoice questionChoice;
            if (requestDto.getId() != null) {
                questionChoice = questionChoiceRepository.findById(requestDto.getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Choice không tồn tại với id: " + requestDto.getId()));

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
            questionChoice.setLessonQuestion(null);
            questionChoice.setExamQuestionId(requestDto.getExamQuestionId());
            questionChoice.setTextForeign(requestDto.getTextForeign());
            questionChoice.setTextRomaji(requestDto.getTextRomaji());
            questionChoice.setIsCorrect(requestDto.getIsCorrect());
            questionChoice.setTextBlock(requestDto.getTextBlock());
            questionChoice.setMeaning(requestDto.getMeaning());

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
        questionChoiceRepository.saveAll(choicesToSave);
        return true;
    }


}

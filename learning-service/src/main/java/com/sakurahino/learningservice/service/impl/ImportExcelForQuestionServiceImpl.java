package com.sakurahino.learningservice.service.impl;

import com.sakurahino.clients.dto.AudioUploadResponseDTO;
import com.sakurahino.clients.feign.UploadServiceClients;
import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.util.TimeUtils;
import com.sakurahino.learningservice.dto.question.LessonQuestionRequest;
import com.sakurahino.learningservice.dto.questionchoice.QuestionChoiceRequest;
import com.sakurahino.learningservice.entity.Lesson;
import com.sakurahino.learningservice.entity.LessonQuestion;
import com.sakurahino.learningservice.entity.QuestionChoice;
import com.sakurahino.learningservice.enums.LearningStatus;
import com.sakurahino.learningservice.enums.QuestionType;
import com.sakurahino.learningservice.repository.LessonQuestionRepository;
import com.sakurahino.learningservice.repository.LessonRepository;
import com.sakurahino.learningservice.repository.QuestionChoiceRepository;
import com.sakurahino.learningservice.service.ImportExcelForQuestionService;
import com.sakurahino.learningservice.utils.language.LanguageUtil;
import com.sakurahino.learningservice.utils.servicehelper.AudioService;
import com.sakurahino.learningservice.utils.valid.LessonQuestionValidator;
import com.sakurahino.learningservice.utils.valid.ValidUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImportExcelForQuestionServiceImpl implements ImportExcelForQuestionService {

    private final LessonQuestionRepository lessonQuestionRepository;
    private final QuestionChoiceRepository questionChoiceRepository;
    private final LessonRepository lessonRepository;
    private final UploadServiceClients uploadServiceClients;
    private final AudioService audioService;

    @Override
    @Transactional
    public void importExcelForQuestion(MultipartFile file) {
        List<String> errorMessages = new ArrayList<>();

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            List<LessonQuestion> questionsToSave = new ArrayList<>();
            List<QuestionChoice> choicesToSave = new ArrayList<>();

            for (int i = 1; i <= sheet.getLastRowNum(); i++) { // bỏ header
                Row row = sheet.getRow(i);
                if (row == null) continue;

                try {
                    LessonQuestionRequest request = parseRow(row);
                    LessonQuestionValidator.validate(request, null, lessonRepository, lessonQuestionRepository, null);

                    switch (request.getQuestionType()) {
                        case WORD_ORDER, PRONUNCIATION, WRITING -> {
                            // vẫn tạo 1 choice mặc định từ row
                            request.setChoiceRequests(parseChoice(row));
                        }

                    }

                    LessonQuestion lq = mapRequestToEntity(request);
                    questionsToSave.add(lq);

                    for (QuestionChoiceRequest cr : request.getChoiceRequests()) {
                        QuestionChoice choice = mapChoiceRequestToEntity(cr, lq);
                        choicesToSave.add(choice);
                    }

                } catch (Exception e) {
                    String msg = "Hàng " + (i + 1) + ": " + e.getMessage();
                    errorMessages.add(msg);
                    log.error(msg, e);
                    // Nếu muốn tiếp tục import các row khác, không throw
                }
            }

            // Nếu có lỗi, thông báo cho người dùng
            if (!errorMessages.isEmpty()) {
                throw new AppException(ExceptionCode.IMPORT_EXCEL_FAILED, String.join("; ", errorMessages));
            }

            // Lưu dữ liệu nếu tất cả row hợp lệ
            lessonQuestionRepository.saveAll(questionsToSave);
            questionChoiceRepository.saveAll(choicesToSave);

        } catch (IOException e) {
            log.error("Import Excel file error", e);
            throw new AppException(ExceptionCode.IMPORT_EXCEL_FAILED, "Không đọc được file Excel");
        }
    }


    private LessonQuestionRequest parseRow(Row row) {
        return LessonQuestionRequest.builder()
                .lessonId((int) row.getCell(1).getNumericCellValue())
                .questionType(QuestionType.valueOf(row.getCell(2).getStringCellValue().toUpperCase()))
                .promptTextTemplate(ValidUtils.cleanText(getString(row.getCell(3))))
                .targetWordNative(ValidUtils.cleanText(getString(row.getCell(4))))
                .status(LearningStatus.valueOf(getString(row.getCell(5)).toUpperCase()))
                .build();
    }

    private List<QuestionChoiceRequest> parseChoice(Row row) {
        String targetWordNative = ValidUtils.cleanText(getString(row.getCell(4)));
        String textRomaji = ValidUtils.cleanText(getString(row.getCell(6)));
        String meaning = ValidUtils.cleanText(getString(row.getCell(7)));

        QuestionChoiceRequest choiceRequest = new QuestionChoiceRequest();
        choiceRequest.setTextRomaji(textRomaji);
        choiceRequest.setIsCorrect(true);

        if (LanguageUtil.isJapanese(targetWordNative)) {
            choiceRequest.setTextForeign(targetWordNative);
            choiceRequest.setMeaning(meaning);
        } else if (LanguageUtil.isVietnamese(targetWordNative)) {
            choiceRequest.setTextForeign(meaning);
            choiceRequest.setMeaning(targetWordNative);
        }

        return List.of(choiceRequest);
    }

    private String getString(Cell cell) {
        if (cell == null) return null;

        DataFormatter formatter = new DataFormatter();
        return formatter.formatCellValue(cell);
    }

    private LessonQuestion mapRequestToEntity(LessonQuestionRequest request) {
        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new AppException(ExceptionCode.LESSON_KHONG_TON_TAI));

        LessonQuestion lq = new LessonQuestion();
        lq.setLesson(lesson);
        lq.setStatus(request.getStatus());
        lq.setQuestionType(request.getQuestionType());
        lq.setTargetWordNative(request.getTargetWordNative());
        lq.setPromptTextTemplate(request.getPromptTextTemplate());
        lq.setCreatedAt(TimeUtils.nowVn());
        if (request.getQuestionType() == QuestionType.PRONUNCIATION){
            AudioUploadResponseDTO response = uploadServiceClients.upLoadText(request.getTargetWordNative());
            lq.setAudioUrl(response.getUrlAudio());
        }
        if (LanguageUtil.isJapanese(request.getTargetWordNative())) {
            lq.setTargetLanguageCode("ja");
        } else if (LanguageUtil.isVietnamese(request.getTargetWordNative())) {
            lq.setTargetLanguageCode("vi");
        } else {
            lq.setTargetLanguageCode("unknown");
        }

        return lq;
    }

    private QuestionChoice mapChoiceRequestToEntity(QuestionChoiceRequest cr, LessonQuestion lq) {
        QuestionChoice choice = new QuestionChoice();
        choice.setLessonQuestion(lq);
        choice.setTextForeign(cr.getTextForeign());
        if (cr.getTextForeign() != null) {
             String audioUrl = audioService.getOrUploadAudio(lq,choice,cr.getTextForeign());
             choice.setAudioUrlForeign(audioUrl);
        }
        choice.setTextRomaji(cr.getTextRomaji());
        choice.setMeaning(cr.getMeaning());
        choice.setIsCorrect(cr.getIsCorrect());
        return choice;
    }
}

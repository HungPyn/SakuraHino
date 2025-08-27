package com.sakurahino.learningservice.service.excel.impl;

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
import com.sakurahino.learningservice.service.excel.ImportExcelForQuestionService;
import com.sakurahino.learningservice.service.excel.QuestionExcelParser;
import com.sakurahino.learningservice.utils.language.LanguageUtil;
import com.sakurahino.learningservice.utils.servicehelper.AudioService;
import com.sakurahino.learningservice.utils.valid.LessonQuestionValidator;
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
    private final List<QuestionExcelParser> parsers;

    @Override
    @Transactional
    public void importExcelForQuestion(MultipartFile file) {
        List<String> errorMessages = new ArrayList<>();

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            List<LessonQuestion> questionsToSave = new ArrayList<>();
            List<QuestionChoice> choicesToSave = new ArrayList<>();

            // Lấy lesson từ đầu
            Lesson lesson = null;
            if (sheet.getLastRowNum() > 0) {
                // Giả sử lessonId ở cột 1 (index 1)
                Row firstDataRow = sheet.getRow(1);
                if (firstDataRow != null) {
                    Integer lessonId = Integer.parseInt(getString(firstDataRow.getCell(1)));
                    lesson = lessonRepository.findById(lessonId)
                            .orElseThrow(() -> new AppException(ExceptionCode.LESSON_KHONG_TON_TAI));
                }
            }

            int publishedCountInDb = lesson != null
                    ? lessonQuestionRepository.countQuestions(lesson.getId(), LearningStatus.PUBLISHED)
                    : 0;

            int publishedCountInExcel = 0;

            for (int i = 1; i <= sheet.getLastRowNum(); i++) { // bỏ header
                Row row = sheet.getRow(i);
                if (isRowEmpty(row)) continue;

                try {
                    QuestionType type = QuestionType.valueOf(getString(row.getCell(2)).trim().toUpperCase());
                    QuestionExcelParser parser = getParser(type);

                    LessonQuestionRequest request = parser.parseRow(row);
                    List<QuestionChoiceRequest> choiceRequests = parser.parseChoice(row);
                    request.setChoiceRequests(choiceRequests);

                    // Nếu là PUBLISHED thì đếm
                    if (request.getStatus() == LearningStatus.PUBLISHED) {
                        publishedCountInExcel++;
                    }

                    // validate DTO bình thường
                    LessonQuestionValidator.validate(request, null, lessonRepository, lessonQuestionRepository, null);

                    // map DTO → entity
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
                }
            }

            // Check tổng số PUBLISHED
            if (lesson != null && publishedCountInDb + publishedCountInExcel > lesson.getMaxQuestions()) {
                throw new AppException(ExceptionCode.MAX_PUBLIC_QUESTION_REACHED,
                        "Tổng số câu PUBLISHED vượt quá giới hạn: " + lesson.getMaxQuestions());
            }

            if (!errorMessages.isEmpty()) {
                throw new AppException(ExceptionCode.IMPORT_EXCEL_FAILED,
                        "Import thất bại: \n" + String.join("\n", errorMessages));
            }

            lessonQuestionRepository.saveAll(questionsToSave);
            questionChoiceRepository.saveAll(choicesToSave);

        } catch (IOException e) {
            log.error("Import Excel file error", e);
            throw new AppException(ExceptionCode.IMPORT_EXCEL_FAILED, "Không đọc được file Excel");
        }
    }


    private QuestionExcelParser getParser(QuestionType type) {
        return parsers.stream()
                .filter(p -> p.support(type))
                .findFirst()
                .orElseThrow(() -> new AppException(ExceptionCode.IMPORT_EXCEL_FAILED,
                        "Không tìm thấy parser cho QuestionType: " + type));
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

        if (request.getQuestionType() == QuestionType.PRONUNCIATION
                || request.getQuestionType() == QuestionType.AUDIO_CHOICE) {
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

        QuestionType type = lq.getQuestionType();
        switch (type) {
            case MULTIPLE_CHOICE_TEXT_ONLY:
            case WORD_ORDER:
                choice.setAudioUrlForeign(audioService.getOrUploadAudio(lq, choice, cr.getTextForeign()));
                break;

            case AUDIO_CHOICE:
            case MULTIPLE_CHOICE_VOCAB_IMAGE:
                if (Boolean.TRUE.equals(cr.getIsCorrect())) {
                    choice.setAudioUrlForeign(audioService.getOrUploadAudio(lq, choice, cr.getTextForeign()));
                }
                break;

            default:
                break;
        }

        choice.setTextRomaji(cr.getTextRomaji());
        choice.setMeaning(cr.getMeaning());
        choice.setIsCorrect(cr.getIsCorrect());
        return choice;
    }

    private boolean isRowEmpty(Row row) {
        if (row == null) return true;
        for (int j = row.getFirstCellNum(); j < row.getLastCellNum(); j++) {
            Cell cell = row.getCell(j);
            if (cell != null && cell.getCellType() != CellType.BLANK && !cell.toString().trim().isEmpty()) {
                return false;
            }
        }
        return true;
    }

    private String getString(Cell cell) {
        if (cell == null) return null;
        DataFormatter formatter = new DataFormatter();
        return formatter.formatCellValue(cell).trim();
    }
}

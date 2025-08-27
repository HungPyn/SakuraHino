package com.sakurahino.learningservice.service.excel.impl;

import com.sakurahino.learningservice.dto.question.LessonQuestionRequest;
import com.sakurahino.learningservice.dto.questionchoice.QuestionChoiceRequest;

import com.sakurahino.learningservice.enums.LearningStatus;
import com.sakurahino.learningservice.enums.QuestionType;
import com.sakurahino.learningservice.service.excel.QuestionExcelParser;
import com.sakurahino.learningservice.utils.language.LanguageUtil;
import com.sakurahino.learningservice.utils.valid.ValidUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.stereotype.Component;

import java.util.List;
@Component
public class NonMcqQuestionExcelParser implements QuestionExcelParser {


    @Override
    public boolean support(QuestionType type) {
        return type == QuestionType.WORD_ORDER
                || type == QuestionType.PRONUNCIATION
                || type == QuestionType.WRITING;
    }

    @Override
    public LessonQuestionRequest parseRow(Row row) {
        return LessonQuestionRequest.builder()
                .lessonId((int) row.getCell(1).getNumericCellValue())
                .questionType(QuestionType.valueOf(row.getCell(2).getStringCellValue().toUpperCase()))
                .promptTextTemplate(ValidUtils.cleanText(getString(row.getCell(3))))
                .targetWordNative(ValidUtils.cleanText(getString(row.getCell(4))))
                .status(LearningStatus.valueOf(getString(row.getCell(5)).toUpperCase()))
                .build();
    }
    @Override
    public List<QuestionChoiceRequest> parseChoice(Row row) {
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
}

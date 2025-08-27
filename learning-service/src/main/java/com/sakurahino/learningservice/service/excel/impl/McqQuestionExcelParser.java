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

import java.util.ArrayList;
import java.util.List;

@Component
public class McqQuestionExcelParser implements QuestionExcelParser {

    @Override
    public boolean support(QuestionType type) {
        return type == QuestionType.MULTIPLE_CHOICE_TEXT_ONLY
                || type == QuestionType.AUDIO_CHOICE;
    }

    @Override
    public LessonQuestionRequest parseRow(Row row) {
        return LessonQuestionRequest.builder()
                .lessonId(Integer.parseInt(getString(row.getCell(1))))
                .questionType(QuestionType.valueOf(getString(row.getCell(2)).toUpperCase()))
                .promptTextTemplate(ValidUtils.cleanText(getString(row.getCell(3))))
                .targetWordNative(ValidUtils.cleanText(getString(row.getCell(4))))
                .status(LearningStatus.valueOf(getString(row.getCell(5)).toUpperCase()))
                .build();
    }

    @Override
    public List<QuestionChoiceRequest> parseChoice(Row row) {
        List<QuestionChoiceRequest> choices = new ArrayList<>();

        for (int i = 0; i < 4; i++) {
            int baseIdx = 6 + i * 3; // đáp án 1 bắt đầu cell 6
            String textForeign = ValidUtils.cleanText(getString(row.getCell(baseIdx)));
            String textRomaji = ValidUtils.cleanText(getString(row.getCell(baseIdx + 1)));
            String meaning = ValidUtils.cleanText(getString(row.getCell(baseIdx + 2)));

            QuestionChoiceRequest choiceRequest = new QuestionChoiceRequest();
            choiceRequest.setTextForeign(textForeign);
            choiceRequest.setTextRomaji(textRomaji);
            choiceRequest.setMeaning(meaning);
            // check đáp án đúng
            String targetWord = ValidUtils.cleanText(getString(row.getCell(4)));
            if (LanguageUtil.isJapanese(targetWord)) {
                choiceRequest.setIsCorrect(targetWord.equals(textForeign));
            } else if (LanguageUtil.isVietnamese(targetWord)) {
                choiceRequest.setIsCorrect(targetWord.equals(meaning));
            }

            choices.add(choiceRequest);
        }

        return choices;
    }

    private String getString(Cell cell) {
        if (cell == null) return null;
        DataFormatter formatter = new DataFormatter();
        return formatter.formatCellValue(cell).trim();
    }
}

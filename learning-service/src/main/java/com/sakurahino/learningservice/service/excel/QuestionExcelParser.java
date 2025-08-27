package com.sakurahino.learningservice.service.excel;

import com.sakurahino.learningservice.dto.question.LessonQuestionRequest;
import com.sakurahino.learningservice.dto.questionchoice.QuestionChoiceRequest;
import com.sakurahino.learningservice.enums.QuestionType;
import org.apache.poi.ss.usermodel.Row;

import java.util.List;

public interface QuestionExcelParser {
    boolean support(QuestionType type);
    LessonQuestionRequest parseRow(Row row);
    public List<QuestionChoiceRequest> parseChoice(Row row);
}

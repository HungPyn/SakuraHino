package com.sakurahino.learningservice.service;


import com.sakurahino.learningservice.dto.questionchoice.QuestionChoiceRequest;
import com.sakurahino.learningservice.entity.Lesson;
import com.sakurahino.learningservice.entity.LessonQuestion;
import com.sakurahino.learningservice.entity.QuestionChoice;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface QuestionChoiceService {

    void addQuestionChoice(LessonQuestion lessonQuestion, List<QuestionChoiceRequest> choiceRequests, Map<String, MultipartFile> imageFilesMap);

    void updateQuestionChoice(Integer questionChoiceId,
                              QuestionChoiceRequest req,
                              Map<String, MultipartFile> imageFilesMa);
}

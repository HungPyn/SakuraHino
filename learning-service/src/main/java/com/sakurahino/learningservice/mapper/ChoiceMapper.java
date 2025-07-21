package com.sakurahino.learningservice.mapper;

import com.sakurahino.learningservice.dto.QuestionChoiceRequest;
import com.sakurahino.learningservice.dto.QuestionChoiceResponse;
import com.sakurahino.learningservice.entity.QuestionChoice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ChoiceMapper {
    @Mapping(source = "lessonQuestion.id", target = "lessonQuestionId")
    QuestionChoiceResponse mapChoiceResponse(QuestionChoice questionChoice);

    QuestionChoice mapRequestToChoice(QuestionChoiceRequest questionChoiceRequest);

    List<QuestionChoiceResponse> mapChoiceListToResponseList(List<QuestionChoice> questionChoices);
    List<QuestionChoice> mapResponseListToChoiceList(List<QuestionChoiceResponse> choiceResponses);

}

package com.sakurahino.learningservice.mapper;

import com.sakurahino.learningservice.dto.result.LessonResultRequestDTO;
import com.sakurahino.learningservice.dto.result.LessonResultResponseDTO;
import com.sakurahino.learningservice.dto.result.PracticeResultResponseDTO;
import com.sakurahino.learningservice.entity.LessonResult;
import com.sakurahino.learningservice.entity.PracticeResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ResultMapper {

    @Mapping(target = "lessonCode", source = "lesson.code")
    LessonResultResponseDTO toLessonResultResponseDTO(LessonResult data);

    @Mapping(target = "topicCode",source = "topic.code")
    PracticeResultResponseDTO toPracticeResultResponseDTO(PracticeResult data);
}

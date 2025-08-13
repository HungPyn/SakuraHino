package com.sakurahino.learningservice.dto.topic;

import com.sakurahino.learningservice.enums.LearningStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatusResponseDTO {

    private LearningStatus status;

}
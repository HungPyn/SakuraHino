package com.sakurahino.learningservice.dto.result;

import com.sakurahino.learningservice.enums.ProgressStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseStatsResultDTO {

    private String userId;

    private String topicName;

    private String LessonName;

    private String  status;
}

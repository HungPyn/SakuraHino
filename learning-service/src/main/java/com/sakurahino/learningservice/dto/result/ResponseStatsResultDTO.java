package com.sakurahino.learningservice.dto.result;

import com.sakurahino.learningservice.enums.ProgressStatus;
import com.sakurahino.learningservice.enums.ResultStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseStatsResultDTO {

    private String userId;

    private String userName;

    private String topicName;

    private String LessonName;

    private Long score;

    private Long durationSeconds;

    private ZonedDateTime completedAt;

    private ResultStatus status;

    public ResponseStatsResultDTO(String userId, String topicName, String lessonName, Long score, Long durationSeconds, ZonedDateTime completedAt, ResultStatus status) {
        this.userId = userId;
        this.topicName = topicName;
        LessonName = lessonName;
        this.score = score;
        this.durationSeconds = durationSeconds;
        this.completedAt = completedAt;
        this.status = status;
    }
}

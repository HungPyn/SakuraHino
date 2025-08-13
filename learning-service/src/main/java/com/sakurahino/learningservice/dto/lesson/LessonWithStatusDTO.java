package com.sakurahino.learningservice.dto.lesson;

import com.sakurahino.learningservice.enums.ProgressStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LessonWithStatusDTO {

    private String lessonCode;

    private String lessonName;

    private String topicCode;

    private int position;

    private ProgressStatus status;
}

package com.sakurahino.learningservice.dto.topic;

import com.sakurahino.learningservice.dto.lesson.LessonWithStatusDTO;
import com.sakurahino.learningservice.enums.ProgressStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopicWithStatusDTO {

    private String topicCode;

    private String topicName;

    private Integer position;

    private ProgressStatus progressStatus;

    private String urlImage;

    private List<LessonWithStatusDTO> listLesson;

    public TopicWithStatusDTO(String topicCode, String topicName, Integer position, ProgressStatus progressStatus,String urlImage) {
        this.topicCode = topicCode;
        this.topicName = topicName;
        this.position = position;
        this.progressStatus = progressStatus;
        this.urlImage = urlImage;
    }

}

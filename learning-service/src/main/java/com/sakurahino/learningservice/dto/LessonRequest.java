package com.sakurahino.learningservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LessonRequest {

    @NotBlank(message = "Không được để trống tên lesson")
    private String lessonName;

    @NotNull(message = "Không được để trống topicId")
    private Integer topicId;

}

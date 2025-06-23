package com.sakurahino.lessonservice.dto.lesson;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LessonRequestDto {
        private Integer id;

        @NotBlank(message = "Không được để trống tên lession")
        private String lessonName;
        private Integer topicId;
}

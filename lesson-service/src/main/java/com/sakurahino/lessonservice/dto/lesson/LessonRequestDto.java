package com.sakurahino.lessonservice.dto.lesson;

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
public class LessonRequestDto {

        @NotBlank(message = "Không được để trống tên lession")
        private String lessonName;

        @NotNull(message = "Không được để trống toppic id")
        private Integer topicId;
}

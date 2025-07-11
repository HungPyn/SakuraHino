package com.sakurahino.learningservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuestionChoiceRequest {
    private Integer id; // để trống id nếu thêm mới
    private Integer lessonId;
    private String textForeign;
    private String textRomaji;

    private MultipartFile imageFile;

    private String textAudioChoice;

    private Boolean isCorrect = false;

    private String textBlock;

    private String meaning;
}

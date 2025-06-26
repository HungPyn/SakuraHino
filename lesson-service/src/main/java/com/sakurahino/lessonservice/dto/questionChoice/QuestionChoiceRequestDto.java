package com.sakurahino.lessonservice.dto.questionChoice;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.web.multipart.MultipartFile;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuestionChoiceRequestDto {


    private Integer id;    //bỏ id ở fontend nếu là tạo mới

    private Integer examQuestionId;

    private String textForeign;

    private String textRomaji;

    private MultipartFile imageFile;

    private String audioUrlForeign;

    @NotNull(message = "Cần xác định lựa chọn đúng hay sai")
    private Boolean isCorrect = false;

    @JdbcTypeCode(SqlTypes.JSON)
    private String textBlock;

    @NotBlank(message = "Không được để trống nghĩa")
    private String meaning;
}

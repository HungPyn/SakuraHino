package com.sakurahino.learningservice.dto.questionchoice;

import com.sakurahino.learningservice.utils.valid.JapaneseText;
import com.sakurahino.learningservice.utils.valid.RomajiText;
import com.sakurahino.learningservice.utils.valid.VietnameseText;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuestionChoiceRequest {

    private Integer id;
    // ID của đáp án (nếu thêm mới thì để trống, khi update thì cần truyền vào)

    @NotBlank(message = "Đáp án tiếng Nhật không được trống")
    @JapaneseText
    private String textForeign;
    // Nội dung đáp án bằng tiếng nước ngoài (ví dụ: tiếng Nhật, tiếng Anh...)

    @NotBlank(message = "Phiên âm tiếng Nhật không được trống")
    @RomajiText
    private String textRomaji;
    // Phiên âm Romaji (áp dụng cho tiếng Nhật), hỗ trợ người học đọc đáp án

    // cái anfy để check các choice có ảnh theo tuần tự thì mới biết đc
    private String imageKey;

    private Boolean isCorrect;
    // Đánh dấu đáp án đúng (true) hoặc sai (false)

    @NotBlank(message = "Nghĩa tiếng Việt không được để trống")
    @VietnameseText
    private String meaning;
    // Nghĩa của đáp án bằng tiếng Việt (hoặc ngôn ngữ đích), bắt buộc phải có
}

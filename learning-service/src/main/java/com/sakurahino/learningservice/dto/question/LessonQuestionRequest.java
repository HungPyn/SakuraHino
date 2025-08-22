package com.sakurahino.learningservice.dto.question;

import com.sakurahino.learningservice.dto.questionchoice.QuestionChoiceRequest;
import com.sakurahino.learningservice.enums.LearningStatus;
import com.sakurahino.learningservice.enums.QuestionType;
import com.sakurahino.learningservice.utils.valid.JapaneseOrVietnameseText;
import com.sakurahino.learningservice.utils.valid.JapaneseText;
import com.sakurahino.learningservice.utils.valid.ValidChoiceForQuestionType;
import com.sakurahino.learningservice.utils.valid.VietnameseText;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ValidChoiceForQuestionType // Áp dụng validator tùy theo loại câu hỏi (ví dụ: kiểm tra số lượng choice, hình ảnh...)
public class LessonQuestionRequest {

    @NotNull(message = "Bài học chủ đề không được để trống")
    private Integer lessonId;
    // ID của bài học (Lesson) mà câu hỏi thuộc về. Bắt buộc để biết câu hỏi này liên kết với bài học nào.

    @NotNull(message = "Loại câu hỏi không được để trống")
    private QuestionType questionType;
    // Loại câu hỏi (enum QuestionType) như MULTIPLE_CHOICE_VOCAB_IMAGE, AUDIO_CHOICE,...
    // Bắt buộc để xác định cách validate và hiển thị câu hỏi.

    @NotBlank(message = "Nội dung câu hỏi không được để trống")
    private String promptTextTemplate;
    // Nội dung câu hỏi hiển thị cho người dùng. Ví dụ: "Chọn hình đúng với từ 'りんご'" hoặc "Nghe từ và chọn đáp án đúng"

    @NotBlank(message = "Đáp án đúng của câu hỏi không được để trống")
    @JapaneseOrVietnameseText
    private String targetWordNative;
    // Kết quả đúng của câu hỏi, thường là từ/câu tiếng bản địa (Japanese) hoặc tiếng Việt
    // Có thể dùng để so sánh đáp án người dùng nhập hoặc chọn. Bắt buộc.

    @NotNull(message = "Trạng thái không được trống")
    private LearningStatus status;

    @Valid
    private List<QuestionChoiceRequest> choiceRequests;
    // Danh sách các lựa chọn của câu hỏi (4 choices cho dạng multiple choice)
    // Áp dụng @Valid để cascade validate các trường bên trong QuestionChoiceRequest
    // Có validator riêng kiểm tra số lượng, số đáp án đúng, hình ảnh, ...
}


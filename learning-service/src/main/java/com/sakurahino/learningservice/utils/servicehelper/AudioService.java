package com.sakurahino.learningservice.utils.servicehelper;

import com.sakurahino.clients.dto.AudioUploadResponseDTO;
import com.sakurahino.clients.feign.UploadServiceClients;
import com.sakurahino.learningservice.entity.LessonQuestion;
import com.sakurahino.learningservice.entity.QuestionChoice;
import com.sakurahino.learningservice.repository.LessonQuestionRepository;
import com.sakurahino.learningservice.repository.QuestionChoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class AudioService {

    private final UploadServiceClients uploadServiceClients;
    private final QuestionChoiceRepository questionChoiceRepository;
    private final LessonQuestionRepository lessonQuestionRepository;

    /**
     * Cache tạm để tránh upload trùng trong cùng phiên tạo/update
     * Key: textForeign, Value: URL audio
     */
    private final Map<String, String> audioCache = new ConcurrentHashMap<>();

    /**
     * Lấy URL audio nếu đã tồn tại hoặc upload mới
     *
     * @param question    LessonQuestion (để check audioUrl)
     * @param choice      QuestionChoice (nếu đang update)
     * @param textForeign Text nguồn cần tạo audio
     * @return URL audio dùng cho LessonQuestion hoặc Choice
     */
    public String getOrUploadAudio(LessonQuestion question, QuestionChoice choice, String textForeign) {
        if (textForeign == null || textForeign.isBlank()) return null;

        // 1. Nếu đang update choice, dùng luôn URL đã có
        if (choice != null && choice.getAudioUrlForeign() != null && !choice.getAudioUrlForeign().isBlank()) {
            return choice.getAudioUrlForeign();
        }

        // 2. Check DB: bất kỳ LessonQuestion nào có targetWordNative và targetLanguageCode trùng
        LessonQuestion existingQuestion = lessonQuestionRepository
                .findTop1ByTargetWordNativeAndTargetLanguageCodeAndAudioUrlIsNotNull(textForeign, "ja")
                .orElse(null);
        if (existingQuestion != null) {
            return existingQuestion.getAudioUrl(); // Dùng luôn audio của question này
        }

        // 3. Check DB: tìm choice bất kỳ đã có audio cho textForeign
        QuestionChoice existingChoice = questionChoiceRepository
                .findTop1ByTextForeignAndAudioUrlForeignIsNotNull(textForeign)
                .orElse(null);
        if (existingChoice != null) {
            return existingChoice.getAudioUrlForeign();
        }

        // 3. Check LessonQuestion audioUrl nếu text giống targetWordNative
        if (question != null
                && textForeign.equals(question.getTargetWordNative())
                && question.getAudioUrl() != null && !question.getAudioUrl().isBlank()) {
            return question.getAudioUrl();
        }

        // 4. Check cache RAM
        if (audioCache.containsKey(textForeign)) {
            return audioCache.get(textForeign);
        }

        // 5. Upload mới
        try {
            AudioUploadResponseDTO response = uploadServiceClients.upLoadText(textForeign);
            String url = response.getUrlAudio();
            audioCache.put(textForeign, url);
            return url;
        } catch (Exception e) {
            log.error("Failed to upload audio for text: {}", textForeign, e);
            return null; // hoặc trả về giá trị fallback
        }
    }

    /** Clear cache nếu cần (ví dụ sau khi create/update xong) */
    public void clearCache() {
        audioCache.clear();
    }
}

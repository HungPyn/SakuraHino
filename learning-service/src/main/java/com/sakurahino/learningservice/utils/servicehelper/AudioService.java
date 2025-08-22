package com.sakurahino.learningservice.utils.servicehelper;

import com.sakurahino.clients.dto.AudioUploadResponseDTO;
import com.sakurahino.clients.feign.UploadServiceClients;
import com.sakurahino.learningservice.entity.LessonQuestion;
import com.sakurahino.learningservice.entity.QuestionChoice;
import com.sakurahino.learningservice.repository.QuestionChoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AudioService {

    private final UploadServiceClients uploadServiceClients;
    private final QuestionChoiceRepository questionChoiceRepository;

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

        // 2. Check DB: tìm choice bất kỳ đã có audio cho textForeign
        QuestionChoice existingChoice = questionChoiceRepository
                .findFirstByTextForeignAndAudioUrlForeignIsNotNull(textForeign)
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
        AudioUploadResponseDTO response = uploadServiceClients.upLoadText(textForeign);
        String url = response.getUrlAudio();
        audioCache.put(textForeign, url);
        return url;
    }

    /** Clear cache nếu cần (ví dụ sau khi create/update xong) */
    public void clearCache() {
        audioCache.clear();
    }
}

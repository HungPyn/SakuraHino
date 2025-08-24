package com.sakurahino.learningservice.utils.language;

import vn.pipeline.Annotation;
import vn.pipeline.VnCoreNLP;
import vn.pipeline.Word;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class VietnameseTokenizerUtil {

    private static final VnCoreNLP pipeline;

    static {
        try {
            // Chỉ dùng word segmentation
            String[] annotators = {"wseg"};
            // VnCoreNLP tự tìm models trong classpath
            pipeline = new VnCoreNLP(annotators);
        } catch (IOException e) {
            throw new RuntimeException("Không load được VnCoreNLP: " + e.getMessage(), e);
        }
    }

    /**
     * Tách từ tiếng Việt theo thứ tự gốc.
     * @param text Văn bản đầu vào
     * @return Danh sách từ theo thứ tự gốc
     */
    public static List<String> tokenize(String text) {
        return tokenize(text, true);
    }

    /**
     * Tách từ tiếng Việt, có thể shuffle nếu cần (WORD_ORDER).
     * @param text Văn bản đầu vào
     * @param shuffle Nếu true sẽ đảo thứ tự từ
     * @return Danh sách từ
     */
    public static List<String> tokenize(String text, boolean shuffle) {
        try {
            Annotation annotation = new Annotation(text);
            pipeline.annotate(annotation);

            // Map token VnCoreNLP → string
            List<String> words = annotation.getWords()
                    .stream()
                    .map(word -> word.getForm().replace("_", " ")) // convert giáo_viên -> giáo viên
                    .collect(Collectors.toList());

            if (shuffle) {
                List<String> shuffled = new ArrayList<>(words);
                Collections.shuffle(shuffled);
                return shuffled;
            }

            return words; // giữ thứ tự gốc
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tách từ tiếng Việt: " + e.getMessage(), e);
        }
    }

}

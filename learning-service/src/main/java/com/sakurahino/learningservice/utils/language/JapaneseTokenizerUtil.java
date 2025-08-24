package com.sakurahino.learningservice.utils.language;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.apache.lucene.analysis.TokenStream;
import org.apache.lucene.analysis.ja.JapaneseTokenizer;
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute;

public class JapaneseTokenizerUtil {

    //   Tách câu tiếng Nhật thành list các từ đơn lẻ.


    public static List<String> tokenize(String text) {
        List<String> tokens = new ArrayList<>();
        // Mode.NORMAL giữ nguyên tất cả từ (trợ từ, đuôi câu)
        JapaneseTokenizer tokenizer = new JapaneseTokenizer(null, false, JapaneseTokenizer.Mode.NORMAL);

        tokenizer.setReader(new StringReader(text));
        try (TokenStream tokenStream = tokenizer) {
            CharTermAttribute charAttr = tokenStream.addAttribute(CharTermAttribute.class);
            tokenStream.reset();
            while (tokenStream.incrementToken()) {
                tokens.add(charAttr.toString());
            }
            tokenStream.end();
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi tách tiếng Nhật: " + e.getMessage(), e);
        }

        // Shuffle nếu muốn random vị trí
        Collections.shuffle(tokens);
        return tokens;
    }

}

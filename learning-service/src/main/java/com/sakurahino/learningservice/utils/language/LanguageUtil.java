package com.sakurahino.learningservice.utils.language;

public class LanguageUtil {

    public static boolean isJapanese(String text) {
        if (text == null || text.isEmpty()) return false;

        for (char c : text.toCharArray()) {
            Character.UnicodeBlock block = Character.UnicodeBlock.of(c);
            if (block == Character.UnicodeBlock.HIRAGANA
                    || block == Character.UnicodeBlock.KATAKANA
                    || block == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS) {
                return true;
            }
        }
        return false;
    }

    public static boolean isVietnamese(String text) {
        if (text == null || text.isEmpty()) return false;

        String vietnameseChars = "ăâđêôơưáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệ"
                + "íìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ";
        for (char c : text.toLowerCase().toCharArray()) {
            if (vietnameseChars.indexOf(c) >= 0) {
                return true;
            }
        }
        return false;
    }
}

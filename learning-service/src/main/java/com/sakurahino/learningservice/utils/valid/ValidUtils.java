package com.sakurahino.learningservice.utils.valid;

public class ValidUtils {

    // Chuẩn hóa để so sánh: trim + gộp khoảng trắng + lowercase
    public static String normalizeForCompare(String input) {
        if (input == null) return null;
        return input.trim().replaceAll("\\s+", " ").toLowerCase();
    }

    // Chỉ trim + gộp khoảng trắng (không đổi chữ hoa/thường)
    public static String cleanText(String input) {
        if (input == null) return null;
        return input.trim().replaceAll("\\s+", " ");
    }
}

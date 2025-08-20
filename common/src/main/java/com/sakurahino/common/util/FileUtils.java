package com.sakurahino.common.util;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

public class FileUtils {

    public static String extractObjectName(String url) {
        if (url == null || url.isEmpty()) return null;

        try {
            // 1. Kiểm tra kiểu Firebase Storage cũ: có /o/
            if (url.contains("/o/")) {
                String[] parts = url.split("/o/");
                if (parts.length < 2) return null;
                String encodedObject = parts[1].split("\\?")[0]; // Lấy phần trước dấu '?'
                return URLDecoder.decode(encodedObject, StandardCharsets.UTF_8);
            }

            // 2. Kiểm tra kiểu Google Storage mới: có /uploads/
            int index = url.indexOf("/uploads/");
            if (index != -1) {
                return url.substring(index + 1); // Lấy "uploads/abc.jpg"
            }

            // 3. Không xác định kiểu URL → return null
            return null;
        } catch (Exception e) {
            return null;
        }
    }

}

package com.sakurahino.common.util;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

public class FileUtils {

    public static String extractObjectName(String url) {
        if (url == null || url.isEmpty()) return null;

        try {
            String[] parts = url.split("/o/");
            if (parts.length < 2) return null;

            String encodedObject = parts[1].split("\\?")[0]; // Lấy phần trước dấu '?'
            return URLDecoder.decode(encodedObject, StandardCharsets.UTF_8); // Giải mã %2F thành /
        } catch (Exception e) {
            return null;
        }
    }
}

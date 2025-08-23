package com.sakurahino.common.util;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class TimeUtils {


    public static final ZoneId VN_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    // Lấy thời điểm hiện tại theo VN nhưng trả về Instant (UTC)
    public static Instant nowInstant() {
        return ZonedDateTime.now(VN_ZONE).toInstant();
    }

    // Lấy giờ VN hiện tại
    public static ZonedDateTime nowVn() {
        return ZonedDateTime.now(VN_ZONE);
    }

    // Convert Instant sang giờ VN
    public static ZonedDateTime toVn(Instant instant) {
        return instant.atZone(VN_ZONE);
    }

    // Lấy 00:00 giờ VN hôm nay dưới dạng Instant (UTC)
    public static Instant startOfDayInstant() {
        return ZonedDateTime.now(VN_ZONE)
                .toLocalDate()                 // Lấy ngày hiện tại
                .atStartOfDay(VN_ZONE)         // 00:00 giờ VN
                .toInstant();                  // Chuyển sang Instant (UTC)
    }
}

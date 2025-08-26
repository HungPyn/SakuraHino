package com.sakurahino.common.util;

import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.time.ZonedDateTime;
@Component
public class TimeUtils {


    public static final ZoneId VN_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    // Lấy thời điểm hiện tại theo VN nhưng trả về Instant (UTC)

    // Lấy giờ VN hiện tại
    public static ZonedDateTime nowVn() {
        return ZonedDateTime.now(VN_ZONE);
    }

    // Lấy 00:00 giờ VN hôm nay
    public static ZonedDateTime startOfDayVietNam() {
        return ZonedDateTime.now(VN_ZONE)
                .toLocalDate()                 // Lấy ngày hiện tại
                .atStartOfDay(VN_ZONE);         // 00:00 giờ VN;
    }
}

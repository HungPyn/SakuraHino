package com.sakurahino.clients.rabitmqModel.learning;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StreakAndExpUpdateMessageDTO {
    private String userId;
    private int expAmount;       // số exp cộng
    private Integer longStreak;  // số ngày streak liên tiếp (null nếu không cập nhật)
    private ZonedDateTime eventTime;   // thời điểm event xảy ra
}

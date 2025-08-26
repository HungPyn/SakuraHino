package com.sakurahino.userservice.service.impl;

import com.sakurahino.clients.rabitmqModel.learning.UserIsNewUpdateMessageDTO;
import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.util.TimeUtils;
import com.sakurahino.userservice.entity.User;
import com.sakurahino.userservice.repository.UserRepository;
import com.sakurahino.userservice.service.UserProgressService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserProgressServiceImpl implements UserProgressService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public void updateExpAndStreak(String userId, int expAmount, int streakIncrement, ZonedDateTime eventTime) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ExceptionCode.TAI_KHOAN_KHONG_TON_TAI));

        log.info("[UserProgress] Bắt đầu cập nhật cho userId={} | expAmount={} | streakIncrement={} | eventTime={}",
                userId, expAmount, streakIncrement, eventTime);

        if (expAmount != 0) {
            long oldExp = user.getExpScore();
            user.setExpScore(oldExp + expAmount);
            log.info("[UserProgress] User {}: Exp {} -> {}", userId, oldExp, user.getExpScore());
        }

        if (streakIncrement != 0) {
            int oldStreak = user.getLongStreak();
            user.setLongStreak(oldStreak + streakIncrement);
            log.info("[UserProgress] User {}: Streak {} -> {}", userId, oldStreak, user.getLongStreak());
        }

        boolean freeze = Boolean.TRUE.equals(user.getFreeze());
        if (!freeze && user.getLongStreak() % 5 == 0 && user.getLongStreak() > 0) {
            user.setFreeze(true);
            log.info("[UserProgress] User {} đạt {} ngày streak, bật freeze!", userId, user.getLongStreak());
        }

        user.setLastDateLogin(eventTime);
        log.info("[UserProgress] Trạng thái cuối: Exp={}, Streak={}, Freeze={}, UpdatedDay={}",
                user.getExpScore(), user.getLongStreak(), user.getFreeze(), user.getUpdatedDay());

        userRepository.save(user);
        log.info("[UserProgress] Đã lưu cập nhật cho user {}", userId);
    }

    @Override
    public void updateIsNewUser(UserIsNewUpdateMessageDTO messageDTO) {
        User user = userRepository.findById(messageDTO.getUserId())
                .orElseThrow(() -> new AppException(ExceptionCode.TAI_KHOAN_KHONG_TON_TAI));

        log.info("[User Is New User] Bắt đầu cập nhập trạng thái cho userId={}",
                user.getId());
        ZonedDateTime updatedUtc = TimeUtils.nowVn();
        user.setUpdatedDay(updatedUtc);
        user.setIsNewUser(messageDTO.getIsNew());
        userRepository.save(user);
    }

}

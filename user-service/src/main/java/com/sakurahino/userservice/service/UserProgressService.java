package com.sakurahino.userservice.service;

import com.sakurahino.clients.rabitmqModel.learning.UserIsNewUpdateMessageDTO;

import java.time.Instant;

public interface UserProgressService {
    void updateExpAndStreak(String userId, int expAmount, int streakIncrement, Instant eventTime);

    void updateIsNewUser(UserIsNewUpdateMessageDTO messageDTO);
}

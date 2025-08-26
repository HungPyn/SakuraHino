package com.sakurahino.userservice.service;

import com.sakurahino.clients.rabitmqModel.learning.UserIsNewUpdateMessageDTO;

import java.time.ZonedDateTime;

public interface UserProgressService {
    void updateExpAndStreak(String userId, int expAmount, int streakIncrement, ZonedDateTime eventTime);

    void updateIsNewUser(UserIsNewUpdateMessageDTO messageDTO);
}

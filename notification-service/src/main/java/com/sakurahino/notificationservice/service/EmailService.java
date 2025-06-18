package com.sakurahino.notificationservice.service;

import com.sakurahino.clients.rabitmqModel.SendResetCodeMessage;

public interface EmailService {
    void sendResetPasswordMail(SendResetCodeMessage dto);
}

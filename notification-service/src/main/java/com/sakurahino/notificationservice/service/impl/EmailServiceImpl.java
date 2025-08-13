package com.sakurahino.notificationservice.service.impl;

import com.sakurahino.clients.rabitmqModel.SendResetCodeMessage;
import com.sakurahino.notificationservice.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${MAIL_USERNAME}")
    private String from;

    @Override
    public void sendResetPasswordMail(SendResetCodeMessage dto) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(from);
            helper.setTo(dto.getEmail());
            helper.setSubject("🔐 Mã xác nhận đặt lại mật khẩu");

            String htmlContent = """
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #2c3e50;">Xác nhận đặt lại mật khẩu</h2>
                    <p>Xin chào,</p>
                    <p>Bạn đã yêu cầu đặt lại mật khẩu. Dưới đây là mã xác nhận của bạn:</p>
                    <div style="font-size: 24px; font-weight: bold; color: #e74c3c; margin: 20px 0;">%s</div>
                    <p>Mã này sẽ hết hạn trong <strong>10 phút</strong>.</p>
                    <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                    <hr>
                    <p style="font-size: 12px; color: #999;">Email được gửi từ hệ thống. Vui lòng không trả lời.</p>
                </div>
            """.formatted(dto.getCode());

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Lỗi khi gửi email: " + e.getMessage());
        }
    }
}

package com.sakurahino.authservice.service.impl;

import com.sakurahino.ampqclient.RabbitMQMessageProducer;
import com.sakurahino.authservice.dto.*;
import com.sakurahino.authservice.entity.ResetPassword;
import com.sakurahino.authservice.entity.User;
import com.sakurahino.clients.enums.Role;
import com.sakurahino.clients.enums.UserStatus;
import com.sakurahino.clients.rabitmqModel.user.UserLoggedInDTO;
import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.authservice.repository.PasswordRepository;
import com.sakurahino.authservice.repository.UserRepository;
import com.sakurahino.authservice.security.JwtUtil;
import com.sakurahino.authservice.service.AuthService;
import com.sakurahino.clients.commons.RabbitKey;
import com.sakurahino.clients.rabitmqModel.user.RegisterSuccessDTO;
import com.sakurahino.clients.rabitmqModel.SendResetCodeMessage;
import com.sakurahino.common.util.TimeUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordRepository passwordRepository;
    private final JwtUtil jwtUtil;
    private final RabbitMQMessageProducer rabbitMQProducer;
    private static final ZoneId VN_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    @Override
    public void register(RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new AppException(ExceptionCode.EMAIL_TON_TAI);
        }
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new AppException(ExceptionCode.USERNAME_TON_TAI);
        }

        Instant dayCreation =  ZonedDateTime.now(VN_ZONE).toInstant();
        String id = UUID.randomUUID().toString();
        String password = passwordEncoder.encode(dto.getPassword());
        User user = new User();
        user.setId(id);
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setUsername(dto.getUsername());
        user.setPassword(password);
        user.setRole(dto.getRole());
        user.setDayCreation(dayCreation);
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);

        // đăng ký gửi message rabbit mq
        RegisterSuccessDTO registerSuccessDTO = new RegisterSuccessDTO();
        registerSuccessDTO.setId(user.getId());
        registerSuccessDTO.setName(user.getName());
        registerSuccessDTO.setEmail(user.getEmail());
        registerSuccessDTO.setUsername(user.getUsername());
        registerSuccessDTO.setRole(user.getRole());
        registerSuccessDTO.setDayCreation(user.getDayCreation());
        registerSuccessDTO.setStatus(user.getStatus());
        rabbitMQProducer.publish(
                registerSuccessDTO,
                RabbitKey.EXCHANGE_AUTH,
                RabbitKey.ROUTING_REGISTER_SUCCESS
        );

    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new AppException(ExceptionCode.TAI_KHOAN_KHONG_TON_TAI));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new AppException(ExceptionCode.MAT_KHAU_KHONG_DUNG);
        }
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new AppException(ExceptionCode.USER_BLOCKED);
        }
        String token = jwtUtil.generateToken(user.getId(), user.getRole().toString());
        LoginResponseDTO loginResponseDTO = new LoginResponseDTO();
        loginResponseDTO.setUsername(user.getUsername());
        loginResponseDTO.setToken(token);
        if (user.getRole() == Role.USER) {
            UserLoggedInDTO loggedInDTO = new UserLoggedInDTO();
            loggedInDTO.setUserId(user.getId());
            rabbitMQProducer.publish(loggedInDTO,
                    RabbitKey.EXCHANGE_AUTH,
                    RabbitKey.ROUTING_USER_LOGGED_IN);
        }
        return loginResponseDTO;

    }

    @Override
    public ForgotPasswordEmailResponse getEmailByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ExceptionCode.TAI_KHOAN_KHONG_TON_TAI));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new AppException(ExceptionCode.USER_BLOCKED);
        }

        return new ForgotPasswordEmailResponse(user.getEmail());
    }

    @Override
    public void sendResetCode(ResetPasswordDTO.ForgotPasswordRequest dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new AppException(ExceptionCode.TAI_KHOAN_KHONG_TON_TAI));

        // Tạo code 6 chữ số an toàn
        SecureRandom random = new SecureRandom();
        String code = String.format("%06d", random.nextInt(1000000));

        Instant nowUtc = ZonedDateTime.now(VN_ZONE).toInstant();

        ResetPassword resetPassword = new ResetPassword();
        resetPassword.setUsername(user.getUsername());
        resetPassword.setCode(code);
        resetPassword.setCreatedAt(nowUtc);
        resetPassword.setExpiresAt(nowUtc.plus(10, ChronoUnit.MINUTES));
        resetPassword.setUsed(false);

        passwordRepository.save(resetPassword);

        // Gửi message RabbitMQ
        SendResetCodeMessage message = new SendResetCodeMessage();
        message.setEmail(user.getEmail());
        message.setCode(code);
        rabbitMQProducer.publish(message, RabbitKey.EXCHANGE_AUTH, RabbitKey.ROUTING_SEND_FORGOT_PASSWORD);
    }

    @Override
    public boolean checkCode(ResetPasswordDTO.VerifyCodeRequest dto) {
        ResetPassword resetPassword = passwordRepository.findTopByUsernameOrderByCreatedAtDesc(dto.getUsername())
                .orElseThrow(() -> new AppException(ExceptionCode.TAI_KHOAN_KHONG_TON_TAI));

        if (resetPassword.isUsed()) {
            throw new AppException(ExceptionCode.MA_XAC_NHAN_DA_SU_DUNG);
        }

        if (!resetPassword.getCode().equals(dto.getCode())) {
            throw new AppException(ExceptionCode.MA_XAC_NHAN_KHONG_HOP_LE);
        }

        Instant now = Instant.now();
        if (resetPassword.getExpiresAt().isBefore(now)) {
            throw new AppException(ExceptionCode.MA_XAC_NHAN_HET_HAN);
        }

        // Đánh dấu code đã dùng
        resetPassword.setUsed(true);
        passwordRepository.save(resetPassword);

        return true;
    }

    @Override
    public void resetPassword(ResetPasswordDTO.ResetPasswordRequest dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new AppException(ExceptionCode.TAI_KHOAN_KHONG_TON_TAI));

        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new AppException(ExceptionCode.MAT_KHAU_COMFIRM_SAI);
        }

        // Lấy ResetPassword chưa dùng và hợp lệ
        ResetPassword resetPassword = passwordRepository.findTopByUsernameOrderByCreatedAtDesc(dto.getUsername())
                .filter(r -> !r.isUsed())
                .filter(r -> r.getExpiresAt().isAfter(Instant.now()))
                .orElseThrow(() -> new AppException(ExceptionCode.MA_XAC_NHAN_KHONG_HOP_LE));

        String encodedPassword = passwordEncoder.encode(dto.getNewPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);

        // Đánh dấu code đã dùng
        resetPassword.setUsed(true);
        passwordRepository.save(resetPassword);
    }


    // Chạy mỗi 1 giờ theo giờ VN
    @Scheduled(cron = "0 0 * * * *", zone = "Asia/Ho_Chi_Minh")
    public void cleanupExpiredCodes() {
        Instant now = TimeUtils.nowInstant();
        int deleted = passwordRepository.deleteByUsedTrueOrExpiresAtBefore(now);
        System.out.println("Đã xóa " + deleted + " mã OTP hết hạn hoặc đã dùng.");
    }
}

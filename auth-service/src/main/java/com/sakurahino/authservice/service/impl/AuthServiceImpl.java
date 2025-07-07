package com.sakurahino.authservice.service.impl;

import com.sakurahino.ampqclient.RabbitMQMessageProducer;
import com.sakurahino.authservice.dto.*;
import com.sakurahino.authservice.entity.ResetPassword;
import com.sakurahino.authservice.entity.User;
import com.sakurahino.clients.enums.Role;
import com.sakurahino.clients.rabitmqModel.UserLoggedInDTO;
import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.authservice.repository.PasswordRepository;
import com.sakurahino.authservice.repository.UserRepository;
import com.sakurahino.authservice.security.JwtUtil;
import com.sakurahino.authservice.service.AuthService;
import com.sakurahino.clients.commons.RabbitKey;
import com.sakurahino.clients.rabitmqModel.RegisterSuccessDTO;
import com.sakurahino.clients.rabitmqModel.SendResetCodeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
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

    @Override
    public void register(RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new AppException(ExceptionCode.EMAIL_TON_TAI);
        }
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new AppException(ExceptionCode.USERNAME_TON_TAI);
        }

        Instant dayCreation = Instant.now();
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
        user.setStatus("ACTIVE");
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
        return new ForgotPasswordEmailResponse(user.getEmail());
    }

    @Override
    public void sendResetCode(ResetPasswordDTO.ForgotPasswordRequest verifyCodeRequest) {
        User user = userRepository.findByUsername(verifyCodeRequest.getUsername())
                .orElseThrow(() -> new AppException(ExceptionCode.TAI_KHOAN_KHONG_TON_TAI));

        String code = String.format("%06d", new Random().nextInt(1000000));
        Instant dayCreation = Instant.now();

        ResetPassword resetPassword = new ResetPassword();
        resetPassword.setUsername(user.getUsername());
        resetPassword.setCode(code);
        resetPassword.setCreatedAt(dayCreation);
        resetPassword.setExpiresAt(dayCreation.plus(10, ChronoUnit.MINUTES));
        resetPassword.setUsed(false);

        passwordRepository.save(resetPassword);
        // Gửi message rabbit-mq den notifytion-serivce
        SendResetCodeMessage sendResetCodeMessage = new SendResetCodeMessage();
        sendResetCodeMessage.setEmail(user.getEmail());
        sendResetCodeMessage.setCode(resetPassword.getCode());
        rabbitMQProducer.publish(sendResetCodeMessage, RabbitKey.EXCHANGE_AUTH, RabbitKey.ROUTING_SEND_FORGOT_PASSWORD);

    }

    @Override
    public boolean checkCode(ResetPasswordDTO.VerifyCodeRequest verifyCodeRequest) {
        ResetPassword resetPassword = passwordRepository.findByUsername(verifyCodeRequest.getUsername())
                .orElseThrow(() -> new AppException(ExceptionCode.TAI_KHOAN_KHONG_TON_TAI));
        if (!resetPassword.getCode().equals(verifyCodeRequest.getCode())) {
            throw new AppException(ExceptionCode.MA_XAC_NHAN_KHONG_HOP_LE);
        }
        Instant now = Instant.now();
        Instant expiredAt = resetPassword.getExpiresAt();
        if (expiredAt.isAfter(now)) {
            throw new AppException(ExceptionCode.MA_XAC_NHAN_HET_HAN);
        }
        return true;
    }

    @Override
    public void resetPassword(ResetPasswordDTO.ResetPasswordRequest dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new AppException(ExceptionCode.TAI_KHOAN_KHONG_TON_TAI));

        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new AppException(ExceptionCode.MAT_KHAU_COMFIRM_SAI);
        }
        String password = passwordEncoder.encode(dto.getNewPassword());
        user.setPassword(password);
        userRepository.save(user);
    }

}

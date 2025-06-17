package com.sakurahino.authservice.service.impl;

import com.sakurahino.ampqclient.RabbitMQMessageProducer;
import com.sakurahino.authservice.dto.LoginRequestDTO;
import com.sakurahino.authservice.dto.LoginResponseDTO;
import com.sakurahino.authservice.dto.RegisterRequestDTO;
import com.sakurahino.authservice.entity.User;
import com.sakurahino.authservice.ex.AppException;
import com.sakurahino.authservice.ex.ExceptionCode;
import com.sakurahino.authservice.repository.UserRepository;
import com.sakurahino.authservice.security.JwtUtil;
import com.sakurahino.authservice.service.AuthService;
import com.sakurahino.clients.commons.RabbitKey;
import com.sakurahino.clients.rabitmqModel.RegisterSuccessDTO;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RabbitMQMessageProducer rabbitMQProducer;

    @Override
    public void register(RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())){
            throw new AppException(ExceptionCode.EMAIL_TON_TAI);
        }
        if (userRepository.existsByUsername(dto.getUsername())){
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

        userRepository.save(user);

        // đăng ký gửi message rabbit mq
        RegisterSuccessDTO registerSuccessDTO = new RegisterSuccessDTO();
        registerSuccessDTO.setId(user.getId());
        registerSuccessDTO.setName(user.getName());
        registerSuccessDTO.setEmail(user.getEmail());
        registerSuccessDTO.setUsername(user.getUsername());
        registerSuccessDTO.setPassword(user.getPassword());
        registerSuccessDTO.setRole(user.getRole());
        registerSuccessDTO.setDayCreation(user.getDayCreation());

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

     if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())){
         throw new AppException(ExceptionCode.MAT_KHAU_KHONG_DUNG);
     }
     String token = jwtUtil.generateToken(user.getId(),user.getRole().toString());
     LoginResponseDTO loginResponseDTO = new LoginResponseDTO();
     loginResponseDTO.setUsername(user.getUsername());
     loginResponseDTO.setToken(token);
     return loginResponseDTO;

    }

}

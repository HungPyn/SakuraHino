package com.sakurahino.authservice.service.impl;

import com.sakurahino.authservice.dto.LoginRequestDTO;
import com.sakurahino.authservice.dto.LoginResponseDTO;
import com.sakurahino.authservice.dto.RegisterRequestDTO;
import com.sakurahino.authservice.entity.User;
import com.sakurahino.authservice.ex.AppException;
import com.sakurahino.authservice.ex.ExceptionCode;
import com.sakurahino.authservice.repository.UserRepository;
import com.sakurahino.authservice.security.JwtUtil;
import com.sakurahino.authservice.service.AuthService;
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

    @Override
    public void register(RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())){
            throw new AppException(ExceptionCode.EMAIL_TON_TAI);
        }
        if (userRepository.existsByPhone(dto.getPhone())){
            throw new AppException(ExceptionCode.PHONE_TON_TAI);
        }

        Instant dayCreation = Instant.now();
        String id = UUID.randomUUID().toString();
        String password = passwordEncoder.encode(dto.getPassword());
        User user = new User();
        user.setId(id);
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(password);
        user.setRole(dto.getRole());
        user.setDayCreation(dayCreation);

        userRepository.save(user);
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO dto) {
     User user = userRepository.findByPhone(dto.getPhone())
             .orElseThrow(() -> new AppException(ExceptionCode.TAI_KHOAN_KHONG_TON_TAI));

     if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())){
         throw new AppException(ExceptionCode.MAT_KHAU_KHONG_DUNG);
     }
     String token = jwtUtil.generateToken(user.getId(),user.getRole().toString());
     LoginResponseDTO loginResponseDTO = new LoginResponseDTO();
     loginResponseDTO.setPhone(user.getPhone());
     loginResponseDTO.setToken(token);
     return loginResponseDTO;

    }

}

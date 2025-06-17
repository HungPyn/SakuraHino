package com.sakurahino.userservice.service.impl;

import com.sakurahino.clients.rabitmqModel.RegisterSuccessDTO;
import com.sakurahino.userservice.entity.User;
import com.sakurahino.userservice.repository.UserRepository;
import com.sakurahino.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl  implements UserService {

    private final UserRepository userRepository;

    @Override
    public void handleRegisterSuccess(RegisterSuccessDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            return; // Đã tồn tại, không thêm nữa
        }

        User user = new User();
        user.setId(dto.getId());
        user.setName(dto.getName());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setDayCreation(dto.getDayCreation());
        user.setRole(dto.getRole());

        userRepository.save(user);
    }
}

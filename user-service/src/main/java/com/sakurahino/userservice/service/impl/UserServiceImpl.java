package com.sakurahino.userservice.service.impl;

import com.sakurahino.clients.rabitmqModel.RegisterSuccessDTO;
import com.sakurahino.userservice.dto.ResponseUserDTO;
import com.sakurahino.userservice.entity.User;
import com.sakurahino.userservice.enums.UserStatus;
import com.sakurahino.userservice.mapper.UserServiceMapper;
import com.sakurahino.userservice.repository.UserRepository;
import com.sakurahino.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl  implements UserService {

    private final UserRepository userRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final UserServiceMapper userServiceMapper;


    // xử lý bất đồng bộ ừ auth-service sang
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
        user.setDayCreation(dto.getDayCreation());
        user.setRole(dto.getRole());
        user.setStatus(UserStatus.from(dto.getStatus()));
        userRepository.save(user);
    }

    @Override
    public void markUserOnline(String userId) {
            redisTemplate.opsForValue().set(
                    "user:online:" + userId,   // key
                    "online",                       // value
                    Duration.ofMinutes(5)      // TTL
            );
    }

    @Override
    public boolean isUserOnline(String userId) {
        return Boolean.TRUE.equals(redisTemplate.hasKey("user:online:" + userId));
    }

    @Override
    public List<ResponseUserDTO> getAll() {
        List<User> listUser = userRepository.findAll();
        return listUser.stream().map(userServiceMapper::toResponseUserDTO).collect(Collectors.toList());
    }
}

package com.sakurahino.authservice.service.impl;

import com.sakurahino.authservice.entity.User;
import com.sakurahino.authservice.repository.UserRepository;
import com.sakurahino.authservice.service.UserService;
import com.sakurahino.clients.rabitmqModel.user.UserDeletedDTO;
import com.sakurahino.clients.rabitmqModel.user.UserStatusMessageDTO;
import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public void updateUserStatus(UserStatusMessageDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new AppException(ExceptionCode.TAI_KHOAN_KHONG_TON_TAI));
        user.setStatus(dto.getStatus());
        userRepository.save(user);
    }
}

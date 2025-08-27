package com.sakurahino.userservice.controller;

import com.sakurahino.clients.dto.InternalUserResponse;
import com.sakurahino.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/internal/users")
@RequiredArgsConstructor
public class UserInternalController {
    private final UserRepository userRepository;
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<InternalUserResponse> getAllUsersInternal() {
        return userRepository.findAll()
                .stream()
                .map(user -> new InternalUserResponse(user.getId(), user.getName()))
                .toList();
    }

    @GetMapping("/internal/users/search")
    public List<InternalUserResponse> searchUsers(@RequestParam String keyword) {
        return userRepository.findByUsernameContainingIgnoreCase(keyword)
                .stream()
                .map(user -> new InternalUserResponse(user.getId(), user.getUsername()))
                .toList();
    }
}

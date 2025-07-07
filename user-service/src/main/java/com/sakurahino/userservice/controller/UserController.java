package com.sakurahino.userservice.controller;

import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public SuccessResponse getAllUsers() {
        return new SuccessResponse(userService.getAll());
    }


}

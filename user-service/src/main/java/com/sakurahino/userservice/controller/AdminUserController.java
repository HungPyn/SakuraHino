package com.sakurahino.userservice.controller;

import com.sakurahino.common.dto.PaginatedResponse;
import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.userservice.dto.RequestUserDTO;
import com.sakurahino.userservice.dto.ResponseUserDTO;
import com.sakurahino.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users/admin")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    public SuccessResponse getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PaginatedResponse<ResponseUserDTO> result = userService.getAll(page, size);
        return new SuccessResponse( result);
    }
    @PutMapping("/{userId}")
    public SuccessResponse updateUser(@PathVariable("userId") String userId, @Valid @RequestBody RequestUserDTO dto) {
        var result = userService.updateForAdmin(userId, dto);
        return new SuccessResponse(result);
    }

    @PatchMapping("/{userId}")
    public SuccessResponse patchUser(@PathVariable("userId") String userId) {
        userService.deleteUser(userId);
        return new SuccessResponse();
    }
}

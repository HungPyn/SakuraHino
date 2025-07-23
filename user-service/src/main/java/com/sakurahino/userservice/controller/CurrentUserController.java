package com.sakurahino.userservice.controller;

import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.userservice.dto.UpdateProfileRequestDTO;
import com.sakurahino.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users/user")
@PreAuthorize("hasRole('USER')")
public class CurrentUserController {

    private final UserService userService;

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public SuccessResponse updateUser(@RequestPart("dto") @Valid UpdateProfileRequestDTO dto,
                                      @RequestPart(value = "file",required = false) MultipartFile file ) {
        var result = userService.updateForUser(dto, file);
        return new SuccessResponse(result);
    }

    @GetMapping
    public SuccessResponse getUser() {
        var result = userService.findByIdForUser();
        return new SuccessResponse(result);
    }
    @GetMapping("/checked")
    public SuccessResponse checkUser() {
        var result = userService.checkUser();
        return new SuccessResponse(result);
    }
}

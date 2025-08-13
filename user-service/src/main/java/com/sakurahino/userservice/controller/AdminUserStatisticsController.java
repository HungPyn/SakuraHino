package com.sakurahino.userservice.controller;


import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.userservice.service.UserStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users/admin/statistics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserStatisticsController {

    private final UserStatisticsService userStaticService;

    @GetMapping("/registrations")
    public SuccessResponse getUserStatics()
    {
       var result = userStaticService.getUserRegistrationStats();
       return new SuccessResponse(result);
    }
}

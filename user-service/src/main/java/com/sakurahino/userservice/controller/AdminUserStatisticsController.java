package com.sakurahino.userservice.controller;


import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.userservice.dto.UserStatisticDTO;
import com.sakurahino.userservice.service.UserStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users/admin/statistics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserStatisticsController {

    private final UserStatisticsService userStaticService;

    @GetMapping("/total-with-percent")
    public SuccessResponse getTotalUsersWithPercent() {
        UserStatisticDTO data = userStaticService.getTotalUsersWithPercentChange();
        return new  SuccessResponse(data);
    }

    @GetMapping("/this-month")
    public SuccessResponse getThisMonth() {
        var response = userStaticService.getTotalUserInMonth();
        return new SuccessResponse(response);
    }

    @GetMapping("/registrations")
    public SuccessResponse getRegistrationStats(
            @RequestParam(name = "range", defaultValue = "7") int range) {
        var response = userStaticService.getUserRegistrationStats(range);
        return new SuccessResponse(response);
    }


    @GetMapping("/stats/users/{year}")
    public SuccessResponse getUserStatsByYear(@PathVariable("year") int year) {
            var response = userStaticService.getUserStatsByYear(year);
            return new SuccessResponse(response);
        }

        @GetMapping("stats/long-streaks")
    public SuccessResponse getLongStreakStats() {
        var respones = userStaticService.getTop5UsserUserLongStreak();
        return new SuccessResponse(respones);
        }
    @GetMapping("stats/exp-score")
    public SuccessResponse getExpScoreStats() {
        var respones = userStaticService.getTop5UserExpScore();
        return new SuccessResponse(respones);
    }
}

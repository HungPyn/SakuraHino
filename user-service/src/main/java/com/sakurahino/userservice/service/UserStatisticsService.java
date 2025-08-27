package com.sakurahino.userservice.service;

import com.sakurahino.userservice.dto.PublicUserResponseDTO;
import com.sakurahino.userservice.dto.RegistrationStatDto;
import com.sakurahino.userservice.dto.UserLongStreakDTO;
import com.sakurahino.userservice.dto.UserStatisticDTO;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

public interface UserStatisticsService {

     List<PublicUserResponseDTO> topStreaks();
    List<PublicUserResponseDTO> topExp();


    // thống kê ở đây
    UserStatisticDTO getTotalUsersWithPercentChange();

    UserStatisticDTO getTotalUserInMonth();

    List<RegistrationStatDto> getUserRegistrationStats(int rangeDays);

    List<RegistrationStatDto> getUserStatsByYear(int year);

    List<UserLongStreakDTO>  getTop5UsserUserLongStreak();
    List<UserLongStreakDTO> getTop5UserExpScore();

}

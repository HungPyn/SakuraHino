package com.sakurahino.userservice.service.impl;

import com.sakurahino.common.util.TimeUtils;
import com.sakurahino.userservice.dto.PublicUserResponseDTO;
import com.sakurahino.userservice.dto.RegistrationStatDto;
import com.sakurahino.userservice.dto.UserLongStreakDTO;
import com.sakurahino.userservice.dto.UserStatisticDTO;
import com.sakurahino.userservice.entity.User;
import com.sakurahino.userservice.mapper.UserServiceMapper;
import com.sakurahino.userservice.repository.UserRepository;
import com.sakurahino.userservice.service.UserStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class UserStatisticsServiceServiceImpl implements UserStatisticsService {

    private final UserServiceMapper userServiceMapper ;
    private final UserRepository userRepository;

    @Override
    public List<PublicUserResponseDTO> topStreaks() {
        List<User> users = userRepository.findTop5ByOrderByLongStreakDesc();
        List<PublicUserResponseDTO> responseDtos = users.stream()
                .map(userServiceMapper::toPublicUserResponseDTO)
                .collect(Collectors.toList());
        return responseDtos;
    }

    @Override
    public List<PublicUserResponseDTO> topExp() {
        List<User> users = userRepository.findTop5ByOrderByExpScoreDesc();
        List<PublicUserResponseDTO> responseDtos = users.stream()
                .map(userServiceMapper::toPublicUserResponseDTO)
                .collect(Collectors.toList());

        return responseDtos;
    }

    public UserStatisticDTO getTotalUsersWithPercentChange() {
        ZonedDateTime now = TimeUtils.nowVn();

        // Tổng tất cả user đến hiện tại
        long totalUsers = userRepository.count();

        // Tổng user đến cuối hôm qua
        ZonedDateTime startOfToday = TimeUtils.startOfDayVietNam();
        ZonedDateTime endOfYesterday = startOfToday.minusNanos(1);
        long totalYesterdayUsers = userRepository.countByDayCreationBefore(endOfYesterday);

        double percentChange;
        if (totalYesterdayUsers > 0) {
            percentChange = ((double) (totalUsers - totalYesterdayUsers) / totalYesterdayUsers) * 100;
        } else {
            if (totalUsers > 0) {
                percentChange = 100.0; // hôm qua 0, hôm nay có user → coi như tăng 100%
            } else {
                percentChange = 0.0;   // cả hai đều 0
            }
        }

        return new UserStatisticDTO(totalUsers, percentChange);
    }

    @Override
    public UserStatisticDTO getTotalUserInMonth() {
        // Lấy thời điểm đầu tháng này và tháng trước theo múi giờ VN
        YearMonth thisMonth = YearMonth.now();
        YearMonth lastMonth = thisMonth.minusMonths(1);

        ZonedDateTime startOfThisMonth = thisMonth.atDay(1).atStartOfDay(ZoneId.of("Asia/Ho_Chi_Minh"));
        ZonedDateTime startOfLastMonth = lastMonth.atDay(1).atStartOfDay(ZoneId.of("Asia/Ho_Chi_Minh"));

        // Tổng người dùng tháng này
        long totalThisMonth = userRepository.countByDayCreationAfter(startOfThisMonth);

        // Tổng người dùng tháng trước
        long totalLastMonth = userRepository.countByDayCreationBetween(startOfLastMonth, startOfThisMonth);

        double percentChange = totalLastMonth == 0 ? (totalThisMonth > 0 ? 100.0 : 0.0)
                : ((double)(totalThisMonth - totalLastMonth) / totalLastMonth) * 100;

        return new UserStatisticDTO(totalThisMonth, percentChange);
    }




    public List<RegistrationStatDto> getUserRegistrationStats(int rangeDays) {
        ZonedDateTime now = TimeUtils.nowVn();
        ZonedDateTime start = now.minusDays(rangeDays);

        // Convert sang LocalDateTime (vẫn giữ giờ Việt Nam)
        LocalDateTime startLocal = start.toLocalDateTime();
        LocalDateTime nowLocal = now.toLocalDateTime();
        List<Object[]> results;
        if (rangeDays == 7) {
            results = userRepository.countByDay(startLocal, nowLocal);
        } else if (rangeDays == 30) {
            results = userRepository.countByWeek(startLocal, nowLocal);
        } else if (rangeDays == 90) {
            results = userRepository.countByMonth(startLocal, nowLocal);
        } else {
            throw new IllegalArgumentException("Unsupported range: " + rangeDays);
        }

        return results.stream()
                .map(row -> new RegistrationStatDto(
                        row[0].toString(),      // period (DATE, YEARWEEK, DATE_FORMAT)
                        ((Number) row[1]).longValue() // count
                ))
                .toList();
    }
    // Người dùng theo năm
    @Override
    public List<RegistrationStatDto> getUserStatsByYear(int year) {
        LocalDateTime start = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime end = LocalDateTime.of(year, 12, 31, 23, 59);

        List<Object[]> result = userRepository.countByMonth(start, end);

        Map<String, Long> monthCountMap = result.stream()
                .collect(Collectors.toMap(
                        r -> (String) r[0],
                        r -> ((Number) r[1]).longValue()
                ));

        return IntStream.rangeClosed(1, 12)
                .mapToObj(m -> String.format("%d-%02d", year, m))
                .map(m -> RegistrationStatDto.builder()
                        .period(m)
                        .count(monthCountMap.getOrDefault(m, 0L))
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<UserLongStreakDTO> getTop5UsserUserLongStreak() {
        List<User> users = userRepository.findTop5ByOrderByLongStreakDesc();
        return users.stream()
                .map(userServiceMapper::convertToUserLongStreakDTO)
                .collect(Collectors.toList()); // <- thêm dòng này
    }

    @Override
    public List<UserLongStreakDTO> getTop5UserExpScore() {
        List<User> users = userRepository.findTop5ByOrderByExpScoreDesc();
        return users.stream()
                .map(userServiceMapper::convertToUserLongStreakDTO)
                .collect(Collectors.toList()); // <- thêm dòng này
    }
}
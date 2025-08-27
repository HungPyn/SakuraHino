package com.sakurahino.learningservice.service.impl;

import com.sakurahino.clients.dto.InternalUserResponse;
import com.sakurahino.clients.feign.UserServiceClients;
import com.sakurahino.common.util.TimeUtils;
import com.sakurahino.learningservice.dto.result.ResponseStatsResultDTO;
import com.sakurahino.learningservice.dto.statics.RegistrationStatDto;
import com.sakurahino.learningservice.dto.statics.TotalLessonResponseDTO;
import com.sakurahino.learningservice.entity.LessonResult;
import com.sakurahino.learningservice.enums.LearningStatus;
import com.sakurahino.learningservice.enums.ResultStatus;
import com.sakurahino.learningservice.repository.LessonRepository;
import com.sakurahino.learningservice.repository.LessonResultRepository;
import com.sakurahino.learningservice.service.LearningStaticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class LearningStaticServiceImpl implements LearningStaticsService {

    private final LessonRepository lessonRepository;
    private final LessonResultRepository lessonResultRepository;
    private final UserServiceClients userServiceClients;
    @Override
    public TotalLessonResponseDTO getTotalLessonStatics() {
        // 00:00 hôm nay giờ VN
        ZonedDateTime startOfToday = TimeUtils.startOfDayVietNam();

        // Tổng số bài học tính đến thời điểm hiện tại (bao gồm hôm nay)
        long totalLessons = lessonRepository.count();

        // Tổng số bài học tính đến hết hôm qua (không bao gồm hôm nay)
        long totalYesterday = lessonRepository.countByCreatedAtBefore(startOfToday);

        // Tính % tăng dựa trên số bài học hôm nay so với tổng của hôm qua
        double percentChange = (totalYesterday == 0) ?
                (totalLessons > 0 ? 100.0 : 0.0) :
                ((double) (totalLessons - totalYesterday) / totalYesterday) * 100;

        return new TotalLessonResponseDTO(totalLessons, percentChange);
    }

    @Override
    public TotalLessonResponseDTO getTotalLessonByStatus() {
        // 00:00 hôm nay giờ VN
        ZonedDateTime startOfToday = TimeUtils.startOfDayVietNam();

        // Tổng số bài học PUBLISHED tính đến thời điểm hiện tại
        long totalLessonsPublished = lessonRepository.countByStatus(LearningStatus.PUBLISHED);

        // Tổng số bài học PUBLISHED tính đến hết hôm qua
        long totalYesterdayPublished = lessonRepository.countByCreatedAtBeforeAndStatus(startOfToday, LearningStatus.PUBLISHED);

        // Tính % tăng dựa trên số bài học PUBLISHED hôm nay so với tổng hôm qua
        double percentChangePublished = (totalYesterdayPublished == 0) ?
                (totalLessonsPublished > 0 ? 100.0 : 0.0) :
                ((double) (totalLessonsPublished - totalYesterdayPublished) / totalYesterdayPublished) * 100;

        return new TotalLessonResponseDTO(totalLessonsPublished, percentChangePublished);
    }

    @Override
    public List<RegistrationStatDto> getLessonStatsByYear(int year) {
        LocalDateTime start = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime end = LocalDateTime.of(year, 12, 31, 23, 59);

        List<Object[]> result = lessonRepository.countByMonth(start, end);

        // Sửa cast an toàn
        Map<String, Long> monthCountMap = result.stream()
                .collect(Collectors.toMap(
                        r -> (String) r[0],
                        r -> ((Number) r[1]).longValue() // ✅ dùng Number thay vì BigInteger
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
    public List<ResponseStatsResultDTO> findAllUserStats() {
        List<InternalUserResponse> listUser = userServiceClients.getAllUsersInternal();

        Map<String, InternalUserResponse> userMap = listUser.stream()
                .collect(Collectors.toMap(InternalUserResponse::getUserId, Function.identity()));

        return lessonResultRepository.findAllUserStats()
                .stream()
                .map(lr -> {
                    InternalUserResponse user = userMap.get(lr.getUserId());

                    return ResponseStatsResultDTO.builder()
                            .userId(lr.getUserId())
                            .userName(user.getUserName())
                            .topicName(lr.getTopicName())
                            .LessonName(lr.getLessonName())
                            .score(lr.getScore())
                            .durationSeconds(lr.getDurationSeconds())
                            .completedAt(lr.getCompletedAt())
                            .status(lr.getStatus()) // trả enum thẳng
                            .build();
                })
                .toList();
    }

    @Override
    public List<ResponseStatsResultDTO> findAllUserStatsByUser(String keyword) {
        // 1️⃣ Gọi user-service để lấy user thỏa keyword
        List<InternalUserResponse> listUser = userServiceClients.searchUsers(keyword);
        if (listUser.isEmpty()) return List.of();

        // 2️⃣ Tạo list userId
        List<String> userIds = listUser.stream()
                .map(InternalUserResponse::getUserId)
                .toList();

        // 3️⃣ Lấy lessonResult chỉ cho userId này
        List<LessonResult> lessonResults = lessonResultRepository.findByUserIdIn(userIds);

        // 4️⃣ Map userId -> InternalUserResponse
        Map<String, InternalUserResponse> userMap = listUser.stream()
                .collect(Collectors.toMap(InternalUserResponse::getUserId, Function.identity()));

        // 5️⃣ Map sang DTO
        return lessonResults.stream()
                .map(lr -> {
                    InternalUserResponse user = userMap.get(lr.getUserId());
                    return ResponseStatsResultDTO.builder()
                            .userId(lr.getUserId())
                            .userName(user != null ? user.getUserName() : null)
                            .topicName(lr.getLesson().getTopic().getName())
                            .LessonName(lr.getLesson().getLessonName())
                            .score(lr.getScore())
                            .durationSeconds(lr.getDurationSeconds())
                            .completedAt(lr.getCompletedAt())
                            .status(lr.getStatus())
                            .build();
                })
                .toList();
    }

}

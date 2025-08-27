package com.sakurahino.learningservice.service.impl;

import com.sakurahino.common.util.TimeUtils;
import com.sakurahino.learningservice.dto.statics.RegistrationStatDto;
import com.sakurahino.learningservice.dto.statics.TotalLessonResponseDTO;
import com.sakurahino.learningservice.enums.LearningStatus;
import com.sakurahino.learningservice.repository.LessonRepository;
import com.sakurahino.learningservice.service.LearningStaticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class LearningStaticServiceImpl implements LearningStaticsService {

    private final LessonRepository lessonRepository
            ;@Override
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
}

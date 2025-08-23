package com.sakurahino.aphabetservice.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RepetitionScheduler {

    private final RepetitionResetService repetitionResetService;
    @Scheduled(cron = "0 0 1 * * *")
    public void runDailyReset() {
        repetitionResetService.resetOverdueRepetitions();
    }
}

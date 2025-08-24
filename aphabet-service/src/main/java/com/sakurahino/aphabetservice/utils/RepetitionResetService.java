package com.sakurahino.aphabetservice.utils;

import com.sakurahino.aphabetservice.module.entity.AlphabetsUserStatus;
import com.sakurahino.aphabetservice.repository.AlphabetsUserStatusRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RepetitionResetService {

    private final AlphabetsUserStatusRepository alphabetUserStatusRepository;

    @Transactional
    public void resetOverdueRepetitions() {
        LocalDate today = LocalDate.now();
        List<AlphabetsUserStatus> overdueList = alphabetUserStatusRepository
                .findByNextDueDateBefore(today.minusDays(2));
        overdueList.forEach(item -> {
            item.setRepetiton(null);
            item.setNextDueDate(null);
        });

        alphabetUserStatusRepository.saveAll(overdueList);
        log.info("Reset {} record(s) thành công.",overdueList.size());
    }
}


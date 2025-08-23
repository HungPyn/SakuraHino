package com.sakurahino.aphabetservice.repository;

import com.sakurahino.aphabetservice.module.entity.AlphabetsUserStatus;
import com.sakurahino.aphabetservice.service.impl.AlphabetUserStatusServiceImpl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AlphabetsUserStatusRepository extends JpaRepository<AlphabetsUserStatus,Long> {
    List<AlphabetsUserStatus> findByNextDueDateBefore(LocalDate date);

    AlphabetsUserStatus findByAlphabetIdAndUserId(Long alphabetId, String userId);
}

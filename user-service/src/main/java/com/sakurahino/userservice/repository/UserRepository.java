package com.sakurahino.userservice.repository;

import com.sakurahino.clients.enums.Role;
import com.sakurahino.clients.enums.UserStatus;
import com.sakurahino.userservice.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByEmail(String email);

    Page<User> findAllByRoleOrderByDayCreationDesc(Role role, Pageable pageable);

    long countByDayCreationAfter(Instant dayCreationAfter);

    Object findAllByStatus(UserStatus status);

    // 1️ Reset streak nếu không có freeze
    @Modifying
    @Query("""
        UPDATE User us
        SET us.longStreak = 0
        WHERE us.freeze = false
          AND us.lastDateLogin < :yesterday
    """)
    int resetStreakForInactiveUsers(@Param("yesterday") Instant yesterday);

    // 2️ Sử dụng freeze nếu có và bỏ lỡ ngày
    @Modifying
    @Query("""
        UPDATE User us
        SET us.freeze = false
        WHERE us.freeze = true
          AND us.lastDateLogin < :yesterday
    """)
    int useFreezeForInactiveUsers(@Param("yesterday") Instant yesterday);
}


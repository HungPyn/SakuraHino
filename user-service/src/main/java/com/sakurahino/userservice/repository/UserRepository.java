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
import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByEmail(String email);

    Page<User> findAllByRoleOrderByDayCreationDesc(Role role, Pageable pageable);

    long countByDayCreationAfter(ZonedDateTime dayCreationAfter);

    @Query("SELECT u FROM User u " +
            "WHERE (:tuKhoa IS NULL OR u.name LIKE CONCAT('%', :tuKhoa, '%') OR u.email LIKE CONCAT('%', :tuKhoa, '%')) " +
            "  AND (:status IS NULL OR u.status = :status)" +
            "  AND (:role IS NULL OR u.role = :role)")
    Page<User> findByFilters(
            @Param("tuKhoa") String tuKhoa,
            @Param("status") UserStatus status,
            @Param("role") Role role,
            Pageable pageable);

    Object findAllByStatus(UserStatus status);

    // Reset streak nếu không có freeze
    @Modifying
    @Query("""
        UPDATE User us
        SET us.longStreak = 0
        WHERE us.freeze = false
          AND us.lastDateLogin < :yesterday
    """)
    int resetStreakForInactiveUsers(@Param("yesterday") ZonedDateTime yesterday);

    // Sử dụng freeze nếu có và bỏ lỡ ngày
    @Modifying
    @Query("""
        UPDATE User us
        SET us.freeze = false
        WHERE us.freeze = true
          AND us.lastDateLogin < :yesterday
    """)
    int useFreezeForInactiveUsers(@Param("yesterday") ZonedDateTime yesterday);


    // Lấy top 10 expScore cao nhất
    List<User> findTop10ByOrderByExpScoreDesc();

    // Lấy top 10 longStreak cao nhất
    List<User> findTop10ByOrderByLongStreakDesc();

}

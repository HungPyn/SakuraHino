package com.sakurahino.userservice.repository;

import com.sakurahino.clients.enums.Role;
import com.sakurahino.clients.enums.UserStatus;
import com.sakurahino.userservice.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByEmail(String email);

    Page<User> findAllByRoleOrderByDayCreationDesc(Role role, Pageable pageable);

    long countByDayCreationAfter(Instant dayCreationAfter);


    @Query("SELECT u FROM User u " +
            "WHERE (:tuKhoa IS NULL OR u.name LIKE CONCAT('%', :tuKhoa, '%') OR u.email LIKE CONCAT('%', :tuKhoa, '%')) " +
            "  AND (:status IS NULL OR u.status = :status)" +
            "  AND (:role IS NULL OR u.role = :role)") // <-- Đã bổ sung bộ lọc role
    Page<User> findByFilters(
            @Param("tuKhoa") String tuKhoa,
            @Param("status") UserStatus status,
            @Param("role") Role role, // <-- Đã bổ sung tham số
            Pageable pageable);
}


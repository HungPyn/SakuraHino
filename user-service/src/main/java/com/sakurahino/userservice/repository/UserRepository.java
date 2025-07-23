package com.sakurahino.userservice.repository;

import com.sakurahino.clients.enums.Role;
import com.sakurahino.userservice.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByEmail(String email);

    Page<User> findAllByRoleOrderByDayCreationDesc(Role role, Pageable pageable);

}


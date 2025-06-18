package com.sakurahino.authservice.repository;

import com.sakurahino.authservice.entity.ResetPassword;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordRepository extends JpaRepository<ResetPassword, String> {
    Optional<ResetPassword> findByUsername(String username);
}

package com.sakurahino.authservice.repository;

import com.sakurahino.authservice.entity.ResetPassword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordRepository extends JpaRepository<ResetPassword, String> {
    Optional<ResetPassword> findByUsername(String username);
}

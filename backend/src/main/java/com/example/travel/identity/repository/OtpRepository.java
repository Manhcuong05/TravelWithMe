package com.example.travel.identity.repository;

import com.example.travel.identity.entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpToken, Long> {
    Optional<OtpToken> findTopByEmailAndTypeAndUsedIsFalseAndExpiresAtAfterOrderByCreatedAtDesc(
            String email, OtpToken.OtpType type, LocalDateTime now);
}

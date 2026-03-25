package com.example.travel.identity.service;

import com.example.travel.core.exception.BusinessException;
import com.example.travel.core.service.EmailService;
import com.example.travel.identity.entity.OtpToken;
import com.example.travel.identity.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    private static final int OTP_VALIDITY_MINUTES = 10;

    @Transactional
    public void generateAndSendOtp(String email, OtpToken.OtpType type) {
        // Generate 6 digit code
        int codeNum = 100000 + secureRandom.nextInt(900000);
        String code = String.valueOf(codeNum);

        OtpToken otpToken = OtpToken.builder()
                .email(email)
                .code(code)
                .type(type)
                .expiresAt(LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES))
                .used(false)
                .build();

        otpRepository.save(otpToken);

        // Send email asynchronously
        emailService.sendOtpEmail(email, code, type);
        log.info("Generated {} OTP for {}", type, email);
    }

    @Transactional
    public boolean verifyOtp(String email, String code, OtpToken.OtpType type) {
        OtpToken otpToken = otpRepository.findTopByEmailAndTypeAndUsedIsFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                email, type, LocalDateTime.now()
        ).orElseThrow(() -> new BusinessException("INVALID_OTP", "Mã OTP không hợp lệ hoặc đã hết hạn"));

        if (!otpToken.getCode().equals(code)) {
            throw new BusinessException("INVALID_OTP", "Mã OTP không chính xác");
        }

        // Mark as used
        otpToken.setUsed(true);
        otpRepository.save(otpToken);
        log.info("Successfully verified {} OTP for {}", type, email);

        return true;
    }
}

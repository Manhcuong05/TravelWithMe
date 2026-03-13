package com.example.travel.identity.config;

import com.example.travel.core.constant.Role;
import com.example.travel.identity.entity.User;
import com.example.travel.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "admin@travel.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Root Administrator")
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Root Admin account created: {}", adminEmail);
        } else {
            log.info("Root Admin account already exists.");
        }
    }
}

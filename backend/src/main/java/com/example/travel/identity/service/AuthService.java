package com.example.travel.identity.service;

import com.example.travel.core.constant.Role;
import com.example.travel.core.exception.BusinessException;
import com.example.travel.core.util.JwtUtil;
import com.example.travel.identity.dto.AuthResponse;
import com.example.travel.identity.dto.LoginRequest;
import com.example.travel.identity.dto.RegisterRequest;
import com.example.travel.identity.entity.User;
import com.example.travel.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtil jwtUtil;
        private final AuthenticationManager authenticationManager;

        @Value("${google.client.id}")
        private String googleClientId;

        @Transactional
        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new BusinessException("EMAIL_ALREADY_EXISTS", "Email đã tồn tại trong hệ thống");
                }

                User user = User.builder()
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .fullName(request.getFullName())
                                .phone(request.getPhone())
                                .role(Role.TRAVELER)
                                .build();

                userRepository.save(user);

                String jwtToken = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(
                                user.getEmail(), user.getPassword(),
                                java.util.Collections.singletonList(
                                                new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ROLE_" + user.getRole().name()))));

                return buildAuthResponse(user, jwtToken);
        }

        public AuthResponse login(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND",
                                                "Không tìm thấy người dùng"));

                String jwtToken = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(
                                user.getEmail(), user.getPassword(),
                                java.util.Collections.singletonList(
                                                new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ROLE_" + user.getRole().name()))));

                return buildAuthResponse(user, jwtToken);
        }

        @Transactional
        public AuthResponse loginWithGoogle(com.example.travel.identity.dto.GoogleLoginRequest request) {
                try {
                        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                                .setAudience(java.util.Collections.singletonList(googleClientId))
                                .build();

                        GoogleIdToken idToken = verifier.verify(request.getIdToken());
                        if (idToken == null) {
                                throw new BusinessException("INVALID_TOKEN", "Google ID token không hợp lệ");
                        }

                        GoogleIdToken.Payload payload = idToken.getPayload();
                        String email = payload.getEmail();
                        String name = (String) payload.get("name");
                        String pictureUrl = (String) payload.get("picture");

                        User user = userRepository.findByEmail(email).orElseGet(() -> {
                                User newUser = User.builder()
                                        .email(email)
                                        .password(passwordEncoder.encode(java.util.UUID.randomUUID().toString()))
                                        .fullName(name)
                                        .avatarUrl(pictureUrl)
                                        .role(Role.TRAVELER)
                                        .build();
                                return userRepository.save(newUser);
                        });

                        String jwtToken = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(
                                user.getEmail(), user.getPassword(),
                                java.util.Collections.singletonList(
                                                new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ROLE_" + user.getRole().name()))));

                        return buildAuthResponse(user, jwtToken);
                } catch (Exception e) {
                        throw new BusinessException("GOOGLE_AUTH_FAILED", "Xác thực Google thất bại: " + e.getMessage());
                }
        }

        public AuthResponse.UserResponse getMe() {
                String email = com.example.travel.core.util.SecurityUtil.getCurrentUserEmail();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND",
                                                "Không tìm thấy người dùng"));

                return AuthResponse.UserResponse.builder()
                                .id(user.getId())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .role(user.getRole())
                                .phone(user.getPhone())
                                .avatarUrl(user.getAvatarUrl())
                                .build();
        }

        private AuthResponse buildAuthResponse(User user, String token) {
                return AuthResponse.builder()
                                .accessToken(token)
                                .user(AuthResponse.UserResponse.builder()
                                                .id(user.getId())
                                                .email(user.getEmail())
                                                .fullName(user.getFullName())
                                                .role(user.getRole())
                                                .phone(user.getPhone())
                                                .avatarUrl(user.getAvatarUrl())
                                                .build())
                                .build();
        }
}

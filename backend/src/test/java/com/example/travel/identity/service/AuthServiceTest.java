package com.example.travel.identity.service;

import com.example.travel.core.constant.Role;
import com.example.travel.core.exception.BusinessException;
import com.example.travel.core.util.JwtUtil;
import com.example.travel.identity.dto.AuthResponse;
import com.example.travel.identity.dto.LoginRequest;
import com.example.travel.identity.dto.RegisterRequest;
import com.example.travel.identity.entity.User;
import com.example.travel.identity.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {

        // Khởi tạo user mẫu
        user = User.builder()
                .id("U001")
                .email("user@gmail.com")
                .password("encodedPassword")
                .fullName("Test User")
                .role(Role.TRAVELER)
                .build();
    }

    // ===== TEST: REGISTER EMAIL ALREADY EXISTS =====

    @Test
    void register_EmailAlreadyExists_ShouldThrowException() {

        RegisterRequest request = new RegisterRequest();
        request.setEmail("user@gmail.com");

        // Trường hợp email đã tồn tại trong hệ thống
        when(userRepository.existsByEmail("user@gmail.com")).thenReturn(true);

        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> authService.register(request)
        );

        assertEquals("EMAIL_ALREADY_EXISTS", ex.getCode());
    }

    // ===== TEST: REGISTER SUCCESS =====

    @Test
    void register_ValidRequest_ShouldCreateUserAndReturnToken() {

        RegisterRequest request = new RegisterRequest();
        request.setEmail("user@gmail.com");
        request.setPassword("123456");
        request.setFullName("Test User");
        request.setPhone("0123456789");

        when(userRepository.existsByEmail("user@gmail.com")).thenReturn(false);

        // giả lập encode password
        when(passwordEncoder.encode("123456")).thenReturn("encodedPassword");

        // giả lập tạo token
        when(jwtUtil.generateToken(any())).thenReturn("jwt-token");

        when(userRepository.save(any(User.class))).thenReturn(user);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getAccessToken());
        assertEquals("user@gmail.com", response.getUser().getEmail());

        verify(userRepository).save(any(User.class));
    }

    // ===== TEST: LOGIN USER NOT FOUND =====

    @Test
    void login_UserNotFound_ShouldThrowException() {

        LoginRequest request = new LoginRequest();
        request.setEmail("user@gmail.com");
        request.setPassword("123456");

        // authentication thành công nhưng không tìm thấy user
        when(userRepository.findByEmail("user@gmail.com"))
                .thenReturn(Optional.empty());

        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> authService.login(request)
        );

        assertEquals("USER_NOT_FOUND", ex.getCode());
    }

    // ===== TEST: LOGIN SUCCESS =====

    @Test
    void login_ValidCredentials_ShouldReturnToken() {

        LoginRequest request = new LoginRequest();
        request.setEmail("user@gmail.com");
        request.setPassword("123456");

        when(userRepository.findByEmail("user@gmail.com"))
                .thenReturn(Optional.of(user));

        when(jwtUtil.generateToken(any()))
                .thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getAccessToken());
        assertEquals("user@gmail.com", response.getUser().getEmail());
    }
}
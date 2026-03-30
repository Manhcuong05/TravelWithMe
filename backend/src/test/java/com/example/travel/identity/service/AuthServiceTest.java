package com.example.travel.identity.service;

import com.example.travel.core.constant.Role;
import com.example.travel.core.exception.BusinessException;
import com.example.travel.core.util.JwtUtil;
import com.example.travel.core.util.SecurityUtil;
import com.example.travel.identity.dto.*;
import com.example.travel.identity.entity.OtpToken;
import com.example.travel.identity.entity.User;
import com.example.travel.identity.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
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

    @Mock
    private OtpService otpService;

    @InjectMocks
    private AuthService authService;

    private MockedStatic<SecurityUtil> mockedSecurityUtil;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockedSecurityUtil = mockStatic(SecurityUtil.class);

        mockUser = User.builder()
                .id("u123")
                .email("test@travel.com")
                .password("encoded_pwd")
                .fullName("Test User")
                .role(Role.TRAVELER)
                .build();
    }

    @AfterEach
    void tearDown() {
        mockedSecurityUtil.close();
    }

    @Test
    void register_Success() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@travel.com");
        request.setPassword("password123");
        request.setFullName("New User");

        when(userRepository.existsByEmail("new@travel.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded");
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn("fake_jwt");

        // Act
        AuthResponse response = authService.register(request);

        // Assert
        assertNotNull(response);
        assertEquals("fake_jwt", response.getAccessToken());
        assertEquals("new@travel.com", response.getUser().getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_EmailAlreadyExists_ThrowsException() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@travel.com");

        when(userRepository.existsByEmail("test@travel.com")).thenReturn(true);

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> authService.register(request));
        assertEquals("EMAIL_ALREADY_EXISTS", exception.getCode());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("test@travel.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("test@travel.com")).thenReturn(Optional.of(mockUser));
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn("fake_jwt");

        // Act
        AuthResponse response = authService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals("fake_jwt", response.getAccessToken());
        assertEquals("test@travel.com", response.getUser().getEmail());
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void login_UserNotFound_ThrowsException() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("notfound@travel.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("notfound@travel.com")).thenReturn(Optional.empty());

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> authService.login(request));
        assertEquals("USER_NOT_FOUND", exception.getCode());
    }

    @Test
    void sendLoginOtp_Success() {
        // Arrange
        OtpRequest request = new OtpRequest();
        request.setEmail("test@travel.com");

        when(userRepository.findByEmail("test@travel.com")).thenReturn(Optional.of(mockUser));

        // Act
        authService.sendLoginOtp(request);

        // Assert
        verify(otpService, times(1)).generateAndSendOtp("test@travel.com", OtpToken.OtpType.LOGIN);
    }

    @Test
    void loginWithOtp_Success() {
        // Arrange
        VerifyOtpRequest request = new VerifyOtpRequest();
        request.setEmail("test@travel.com");
        request.setCode("123456");

        when(userRepository.findByEmail("test@travel.com")).thenReturn(Optional.of(mockUser));
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn("fake_jwt");

        // Act
        AuthResponse response = authService.loginWithOtp(request);

        // Assert
        assertNotNull(response);
        assertEquals("fake_jwt", response.getAccessToken());
        verify(otpService, times(1)).verifyOtp("test@travel.com", "123456", OtpToken.OtpType.LOGIN);
    }

    @Test
    void resetPassword_Success() {
        // Arrange
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setEmail("test@travel.com");
        request.setCode("123456");
        request.setNewPassword("newPass");

        when(userRepository.findByEmail("test@travel.com")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.encode("newPass")).thenReturn("encoded_new");

        // Act
        authService.resetPassword(request);

        // Assert
        verify(otpService, times(1)).verifyOtp("test@travel.com", "123456", OtpToken.OtpType.RESET_PASSWORD);
        verify(userRepository, times(1)).save(mockUser);
        assertEquals("encoded_new", mockUser.getPassword());
    }

    @Test
    void getMe_Success() {
        // Arrange
        mockedSecurityUtil.when(SecurityUtil::getCurrentUserEmail).thenReturn("test@travel.com");
        when(userRepository.findByEmail("test@travel.com")).thenReturn(Optional.of(mockUser));

        // Act
        AuthResponse.UserResponse result = authService.getMe();

        // Assert
        assertNotNull(result);
        assertEquals("test@travel.com", result.getEmail());
    }
}

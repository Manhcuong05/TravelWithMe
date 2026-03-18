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
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * KIỂM THỬ HỘP TRẮNG - AuthService
 *
 * Kỹ thuật áp dụng:
 * - Statement Coverage: Đảm bảo mọi câu lệnh được thực thi
 * - Branch Coverage: Kiểm tra cả nhánh true/false của điều kiện
 * - Exception Testing: Kiểm tra việc ném ngoại lệ đúng chỗ
 * - Mocking: Dùng Mockito mock UserRepository, PasswordEncoder, JwtUtil,
 * AuthenticationManager
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService - Kiểm thử hộp trắng")
public class AuthServiceTest {

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

    private User mockUser;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id("user-001")
                .email("test@travel.com")
                .password("encoded_password_123")
                .fullName("Nguyen Van A")
                .phone("0901234567")
                .role(Role.TRAVELER)
                .build();

        registerRequest = RegisterRequest.builder()
                .email("test@travel.com")
                .password("password123")
                .fullName("Nguyen Van A")
                .phone("0901234567")
                .build();

        loginRequest = LoginRequest.builder()
                .email("test@travel.com")
                .password("password123")
                .build();
    }

    // =========================================================
    // REGISTER TESTS
    // =========================================================

    @Test
    @DisplayName("TC01 - Đăng ký thành công (Email chưa tồn tại)")
    void testRegister_Success() {
        // Arrange - Statement Coverage: nhánh email chưa tồn tại
        when(userRepository.existsByEmail("test@travel.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded_password_123");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(jwtUtil.generateToken(any())).thenReturn("mock.jwt.token");

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertNotNull(response, "Response không được null");
        assertNotNull(response.getAccessToken(), "Token phải được sinh ra");
        assertNotNull(response.getUser(), "User info phải có trong response");
        assertEquals("test@travel.com", response.getUser().getEmail());
        assertEquals("Nguyen Van A", response.getUser().getFullName());

        verify(userRepository, times(1)).existsByEmail("test@travel.com");
        verify(passwordEncoder, times(1)).encode("password123");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("TC02 - Đăng ký thất bại (Email đã tồn tại) - Branch Coverage")
    void testRegister_EmailAlreadyExists_ThrowsException() {
        // Arrange - Branch Coverage: nhánh email đã tồn tại
        when(userRepository.existsByEmail("test@travel.com")).thenReturn(true);

        // Act & Assert - Exception Testing
        BusinessException ex = assertThrows(BusinessException.class,
                () -> authService.register(registerRequest),
                "Phải ném BusinessException khi email trùng");

        assertEquals("EMAIL_ALREADY_EXISTS", ex.getCode());
        assertTrue(ex.getMessage().contains("Email đã tồn tại"));

        // Verify: không được gọi save khi email đã tồn tại
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("TC03 - Đăng ký với password đúng biên (6 ký tự) - Boundary Value Analysis")
    void testRegister_PasswordAtBoundary_Success() {
        // BVA: password đúng biên dưới = 6 ký tự -> phải thành công
        RegisterRequest boundaryReq = RegisterRequest.builder()
                .email("boundary@travel.com")
                .password("abc123") // Đúng 6 ký tự - biên dưới hợp lệ
                .fullName("Boundary User")
                .build();

        when(userRepository.existsByEmail("boundary@travel.com")).thenReturn(false);
        when(passwordEncoder.encode("abc123")).thenReturn("encoded_abc123");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(jwtUtil.generateToken(any())).thenReturn("mock.jwt.token");

        AuthResponse response = authService.register(boundaryReq);

        assertNotNull(response, "Đăng ký với password 6 ký tự (biên dưới) phải thành công");
        verify(passwordEncoder, times(1)).encode("abc123");
    }

    // =========================================================
    // LOGIN TESTS
    // =========================================================

    @Test
    @DisplayName("TC04 - Đăng nhập thành công - Statement Coverage")
    void testLogin_Success() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null); // Không throw = xác thực thành công
        when(userRepository.findByEmail("test@travel.com")).thenReturn(Optional.of(mockUser));
        when(jwtUtil.generateToken(any())).thenReturn("mock.jwt.token");

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals("mock.jwt.token", response.getAccessToken());
        assertEquals("test@travel.com", response.getUser().getEmail());
        assertEquals(Role.TRAVELER, response.getUser().getRole());

        verify(authenticationManager, times(1)).authenticate(any());
    }

    @Test
    @DisplayName("TC05 - Đăng nhập sai mật khẩu - Exception Testing")
    void testLogin_WrongPassword_ThrowsException() {
        // Arrange - authenticationManager ném lỗi khi sai mật khẩu
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Sai mật khẩu"));

        // Act & Assert
        assertThrows(BadCredentialsException.class,
                () -> authService.login(loginRequest),
                "Phải ném exception khi mật khẩu sai");

        // Verify: không gọi findByEmail khi authentication failed
        verify(userRepository, never()).findByEmail(anyString());
    }

    @Test
    @DisplayName("TC06 - Đăng nhập với email không tồn tại trong DB - Branch Coverage")
    void testLogin_UserNotFoundInDB_ThrowsException() {
        // Arrange - Authentication pass nhưng không tìm thấy trong DB (edge case)
        when(authenticationManager.authenticate(any())).thenReturn(null);
        when(userRepository.findByEmail("test@travel.com")).thenReturn(Optional.empty());

        // Act & Assert - Exception Testing
        BusinessException ex = assertThrows(BusinessException.class,
                () -> authService.login(loginRequest));

        assertEquals("USER_NOT_FOUND", ex.getCode());
    }

    // =========================================================
    // GET ME TESTS
    // =========================================================

    @Test
    @DisplayName("TC07 - Lấy thông tin tài khoản hiện tại - Statement Coverage")
    void testGetMe_Success() {
        // Arrange - Mock static SecurityUtil
        try (MockedStatic<com.example.travel.core.util.SecurityUtil> mocked = mockStatic(
                com.example.travel.core.util.SecurityUtil.class)) {
            mocked.when(com.example.travel.core.util.SecurityUtil::getCurrentUserEmail)
                    .thenReturn("test@travel.com");
            when(userRepository.findByEmail("test@travel.com")).thenReturn(Optional.of(mockUser));

            // Act
            AuthResponse.UserResponse userResponse = authService.getMe();

            // Assert
            assertNotNull(userResponse);
            assertEquals("test@travel.com", userResponse.getEmail());
            assertEquals("Nguyen Van A", userResponse.getFullName());
            assertEquals(Role.TRAVELER, userResponse.getRole());
        }
    }

    @Test
    @DisplayName("TC08 - Lấy thông tin tài khoản - User không tồn tại - Exception Testing")
    void testGetMe_UserNotFound_ThrowsException() {
        try (MockedStatic<com.example.travel.core.util.SecurityUtil> mocked = mockStatic(
                com.example.travel.core.util.SecurityUtil.class)) {
            mocked.when(com.example.travel.core.util.SecurityUtil::getCurrentUserEmail)
                    .thenReturn("ghost@travel.com");
            when(userRepository.findByEmail("ghost@travel.com")).thenReturn(Optional.empty());

            // Act & Assert
            BusinessException ex = assertThrows(BusinessException.class,
                    () -> authService.getMe());

            assertEquals("USER_NOT_FOUND", ex.getCode());
        }
    }
}

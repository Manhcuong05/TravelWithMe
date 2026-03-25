package com.example.travel.identity.controller;

import com.example.travel.core.response.ApiResponse;
import com.example.travel.identity.dto.AuthResponse;
import com.example.travel.identity.dto.LoginRequest;
import com.example.travel.identity.dto.OtpRequest;
import com.example.travel.identity.dto.RegisterRequest;
import com.example.travel.identity.dto.ResetPasswordRequest;
import com.example.travel.identity.dto.VerifyOtpRequest;
import com.example.travel.identity.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success(authService.register(request), "Đăng ký tài khoản thành công");
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(authService.login(request), "Đăng nhập thành công");
    }

    @PostMapping("/google")
    public ApiResponse<AuthResponse> loginWithGoogle(@Valid @RequestBody com.example.travel.identity.dto.GoogleLoginRequest request) {
        return ApiResponse.success(authService.loginWithGoogle(request), "Đăng nhập Google thành công");
    }

    @PostMapping("/send-login-otp")
    public ApiResponse<Void> sendLoginOtp(@Valid @RequestBody OtpRequest request) {
        authService.sendLoginOtp(request);
        return ApiResponse.success(null, "Mã OTP đăng nhập đã được gửi tới email của bạn");
    }

    @PostMapping("/login-otp")
    public ApiResponse<AuthResponse> loginWithOtp(@Valid @RequestBody VerifyOtpRequest request) {
        return ApiResponse.success(authService.loginWithOtp(request), "Đăng nhập bằng OTP thành công");
    }

    @PostMapping("/forgot-password")
    public ApiResponse<Void> forgotPassword(@Valid @RequestBody OtpRequest request) {
        authService.sendPasswordResetOtp(request);
        return ApiResponse.success(null, "Mã OTP khôi phục mật khẩu đã được gửi tới email của bạn");
    }

    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ApiResponse.success(null, "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.");
    }

    @GetMapping("/me")
    public ApiResponse<AuthResponse.UserResponse> getMe() {
        return ApiResponse.success(authService.getMe(), "Lấy thông tin cá nhân thành công");
    }
}

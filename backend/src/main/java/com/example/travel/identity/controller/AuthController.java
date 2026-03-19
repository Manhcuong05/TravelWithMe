package com.example.travel.identity.controller;

import com.example.travel.core.response.ApiResponse;
import com.example.travel.identity.dto.AuthResponse;
import com.example.travel.identity.dto.LoginRequest;
import com.example.travel.identity.dto.RegisterRequest;
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

    @GetMapping("/me")
    public ApiResponse<AuthResponse.UserResponse> getMe() {
        return ApiResponse.success(authService.getMe(), "Lấy thông tin cá nhân thành công");
    }
}

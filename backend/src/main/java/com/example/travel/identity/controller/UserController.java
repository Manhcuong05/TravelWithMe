package com.example.travel.identity.controller;

import com.example.travel.core.response.ApiResponse;
import com.example.travel.identity.dto.AuthResponse;
import com.example.travel.identity.dto.UserUpdateRequest;
import com.example.travel.identity.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/profile")
    public ApiResponse<AuthResponse.UserResponse> updateProfile(@Valid @RequestBody UserUpdateRequest request) {
        return ApiResponse.success(userService.updateProfile(request), "Cập nhật thông tin cá nhân thành công");
    }
}

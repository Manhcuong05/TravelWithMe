package com.example.travel.identity.controller;

import com.example.travel.core.response.ApiResponse;
import com.example.travel.identity.dto.RegisterRequest;
import com.example.travel.identity.entity.User;
import com.example.travel.identity.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/ctv")
    public ApiResponse<User> createCTV(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success(adminService.createCTV(request), "Đã tạo tài khoản CTV thành công");
    }

    @GetMapping("/users")
    public ApiResponse<List<User>> getAllUsers() {
        return ApiResponse.success(adminService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable String id) {
        adminService.deleteUser(id);
        return ApiResponse.success(null, "Đã xóa người dùng thành công");
    }
}

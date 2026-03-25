package com.example.travel.identity.service;

import com.example.travel.core.constant.Role;
import com.example.travel.core.exception.BusinessException;
import com.example.travel.identity.dto.RegisterRequest;
import com.example.travel.identity.entity.User;
import com.example.travel.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User createCTV(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("EMAIL_ALREADY_EXISTS", "Email đã tồn tại");
        }

        User ctv = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(Role.CTV)
                .build();

        return userRepository.save(ctv);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "Không tìm thấy người dùng"));

        if (user.getRole() == Role.ADMIN) {
            throw new BusinessException("CANNOT_DELETE_ADMIN", "Không thể xóa tài khoản Admin");
        }

        userRepository.delete(user);
    }

    @Transactional
    public User updateUser(String userId, com.example.travel.identity.dto.UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "Không tìm thấy người dùng"));

        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("EMAIL_ALREADY_EXISTS", "Email đã tồn tại");
        }

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setAvatarUrl(request.getAvatarUrl());

        return userRepository.save(user);
    }
}

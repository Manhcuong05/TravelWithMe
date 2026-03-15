package com.example.travel.identity.service;

import com.example.travel.core.constant.Role;
import com.example.travel.identity.entity.User;
import com.example.travel.identity.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    private User user;

    @BeforeEach
    void setUp() {

        // Khởi tạo user mẫu
        user = new User();
        user.setId("U001");
        user.setEmail("user@gmail.com");
        user.setPassword("encodedPassword");
        user.setRole(Role.TRAVELER);
    }

    // ===== TEST: USER NOT FOUND =====

    @Test
    void loadUserByUsername_UserNotFound_ShouldThrowException() {

        // Trường hợp: email không tồn tại trong database
        when(userRepository.findByEmail("user@gmail.com"))
                .thenReturn(Optional.empty());

        UsernameNotFoundException ex = assertThrows(
                UsernameNotFoundException.class,
                () -> customUserDetailsService.loadUserByUsername("user@gmail.com")
        );

        assertEquals(
                "User not found with email: user@gmail.com",
                ex.getMessage()
        );
    }

    // ===== TEST: LOAD USER SUCCESS =====

    @Test
    void loadUserByUsername_UserExists_ShouldReturnUserDetails() {

        // Trường hợp: user tồn tại
        when(userRepository.findByEmail("user@gmail.com"))
                .thenReturn(Optional.of(user));

        UserDetails userDetails =
                customUserDetailsService.loadUserByUsername("user@gmail.com");

        assertNotNull(userDetails);

        // kiểm tra email
        assertEquals("user@gmail.com", userDetails.getUsername());

        // kiểm tra password
        assertEquals("encodedPassword", userDetails.getPassword());

        // kiểm tra role
        assertTrue(
                userDetails.getAuthorities()
                        .stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_TRAVELER"))
        );
    }
}
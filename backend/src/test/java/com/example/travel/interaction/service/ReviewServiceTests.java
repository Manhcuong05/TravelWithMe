package com.example.travel.interaction.service;

import com.example.travel.core.exception.BusinessException;
import com.example.travel.core.util.SecurityUtil;
import com.example.travel.identity.entity.User;
import com.example.travel.identity.repository.UserRepository;
import com.example.travel.interaction.entity.Review;
import com.example.travel.interaction.repository.ReviewRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ReviewService reviewService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId("U001");
        user.setEmail("user@gmail.com");
    }

    // ===== TEST: USER NOT FOUND =====

    @Test
    void addReview_UserNotFound_ShouldThrowException() {

        // Giả lập SecurityUtil trả về email của user
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {

            securityUtil.when(SecurityUtil::getCurrentUserEmail)
                    .thenReturn("user@gmail.com");

            // Trường hợp: user không tồn tại trong database
            when(userRepository.findByEmail("user@gmail.com"))
                    .thenReturn(Optional.empty());

            BusinessException ex = assertThrows(
                    BusinessException.class,
                    () -> reviewService.addReview("S001", 5, "Great service")
            );

            assertEquals("USER_NOT_FOUND", ex.getCode());
        }
    }

    // ===== TEST: INVALID RATING =====

    @Test
    void addReview_InvalidRating_ShouldThrowException() {

        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {

            securityUtil.when(SecurityUtil::getCurrentUserEmail)
                    .thenReturn("user@gmail.com");

            when(userRepository.findByEmail("user@gmail.com"))
                    .thenReturn(Optional.of(user));

            // Trường hợp: rating < 1
            BusinessException ex = assertThrows(
                    BusinessException.class,
                    () -> reviewService.addReview("S001", 0, "Bad")
            );

            assertEquals("INVALID_RATING", ex.getCode());
        }
    }

    // ===== TEST: ADD REVIEW SUCCESS =====

    @Test
    void addReview_ValidReview_ShouldSaveReview() {

        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {

            securityUtil.when(SecurityUtil::getCurrentUserEmail)
                    .thenReturn("user@gmail.com");

            when(userRepository.findByEmail("user@gmail.com"))
                    .thenReturn(Optional.of(user));

            when(reviewRepository.save(any(Review.class)))
                    .thenAnswer(i -> i.getArgument(0));

            Review review = reviewService.addReview("S001", 5, "Excellent service");

            assertNotNull(review);
            assertEquals("U001", review.getUserId());
            assertEquals("S001", review.getServiceId());
            assertEquals(5, review.getRating());

            verify(reviewRepository).save(any(Review.class));
        }
    }

    // ===== TEST: GET SERVICE REVIEWS =====

    @Test
    void getServiceReviews_ShouldReturnReviewList() {

        Review review1 = new Review();
        Review review2 = new Review();

        when(reviewRepository.findByServiceId("S001"))
                .thenReturn(List.of(review1, review2));

        List<Review> reviews = reviewService.getServiceReviews("S001");

        assertEquals(2, reviews.size());

        verify(reviewRepository).findByServiceId("S001");
    }
}
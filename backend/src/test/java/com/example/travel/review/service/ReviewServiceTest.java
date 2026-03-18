package com.example.travel.review.service;

import com.example.travel.catalog.dto.ServiceType;
import com.example.travel.core.exception.BusinessException;
import com.example.travel.core.util.SecurityUtil;
import com.example.travel.identity.entity.User;
import com.example.travel.identity.repository.UserRepository;
import com.example.travel.review.dto.ReviewRequest;
import com.example.travel.review.dto.ReviewResponse;
import com.example.travel.review.entity.Review;
import com.example.travel.review.repository.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * KIỂM THỬ HỘP TRẮNG - ReviewService
 *
 * Kỹ thuật áp dụng:
 * - Statement Coverage: Mọi dòng lệnh trong createReview/getServiceReviews được
 * thực thi
 * - Branch Coverage: user != null và user == null khi getServiceReviews
 * (orphaned review)
 * - Exception Testing: USER_NOT_FOUND khi không tìm thấy user và
 * RuntimeException khi save lỗi
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ReviewService - Kiểm thử hộp trắng")
public class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ReviewService reviewService;

    private User mockUser;
    private Review mockReview;
    private ReviewRequest reviewRequest;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id("user-001")
                .email("user@travel.com")
                .fullName("Nguyen Van B")
                .build();

        mockReview = Review.builder()
                .id("review-001")
                .userId("user-001")
                .serviceId("hotel-001")
                .serviceType(ServiceType.HOTEL)
                .rating(5)
                .comment("Khách sạn rất tốt, nhân viên thân thiện!")
                .createdAt(LocalDateTime.now())
                .build();

        reviewRequest = ReviewRequest.builder()
                .serviceId("hotel-001")
                .serviceType(ServiceType.HOTEL)
                .rating(5)
                .comment("Khách sạn rất tốt, nhân viên thân thiện!")
                .build();
    }

    // =========================================================
    // CREATE REVIEW TESTS
    // =========================================================

    @Test
    @DisplayName("TC01 - Tạo đánh giá thành công - Statement Coverage")
    void testCreateReview_Success() {
        try (MockedStatic<SecurityUtil> mocked = mockStatic(SecurityUtil.class)) {
            mocked.when(SecurityUtil::getCurrentUserEmail).thenReturn("user@travel.com");
            when(userRepository.findByEmail("user@travel.com")).thenReturn(Optional.of(mockUser));
            when(reviewRepository.save(any(Review.class))).thenReturn(mockReview);

            ReviewResponse response = reviewService.createReview(reviewRequest);

            assertNotNull(response);
            assertEquals(5, response.getRating());
            assertEquals("Khách sạn rất tốt, nhân viên thân thiện!", response.getComment());
            assertEquals("Nguyen Van B", response.getUserName());

            verify(reviewRepository, times(1)).save(any(Review.class));
        }
    }

    @Test
    @DisplayName("TC02 - Tạo đánh giá với rating khác nhau - Branch Coverage")
    void testCreateReview_Rating1_Success() {
        try (MockedStatic<SecurityUtil> mocked = mockStatic(SecurityUtil.class)) {
            mocked.when(SecurityUtil::getCurrentUserEmail).thenReturn("user@travel.com");
            when(userRepository.findByEmail("user@travel.com")).thenReturn(Optional.of(mockUser));

            Review lowRatingReview = Review.builder()
                    .id("review-002").userId("user-001").serviceId("hotel-001")
                    .serviceType(ServiceType.HOTEL).rating(1)
                    .comment("Trải nghiệm tệ").createdAt(LocalDateTime.now()).build();

            when(reviewRepository.save(any(Review.class))).thenReturn(lowRatingReview);

            ReviewRequest badRequest = ReviewRequest.builder()
                    .serviceId("hotel-001").serviceType(ServiceType.HOTEL)
                    .rating(1).comment("Trải nghiệm tệ").build();

            ReviewResponse response = reviewService.createReview(badRequest);

            assertEquals(1, response.getRating());
            assertEquals("Trải nghiệm tệ", response.getComment());
        }
    }

    @Test
    @DisplayName("TC03 - Tạo đánh giá khi không tìm thấy User - Exception Testing")
    void testCreateReview_UserNotFound_ThrowsException() {
        try (MockedStatic<SecurityUtil> mocked = mockStatic(SecurityUtil.class)) {
            mocked.when(SecurityUtil::getCurrentUserEmail).thenReturn("ghost@travel.com");
            when(userRepository.findByEmail("ghost@travel.com")).thenReturn(Optional.empty());

            BusinessException ex = assertThrows(BusinessException.class,
                    () -> reviewService.createReview(reviewRequest));

            assertEquals("USER_NOT_FOUND", ex.getCode());
            verify(reviewRepository, never()).save(any());
        }
    }

    @Test
    @DisplayName("TC04 - Lỗi khi lưu đánh giá vào DB - Exception Testing")
    void testCreateReview_SaveThrowsException_PropagatesException() {
        try (MockedStatic<SecurityUtil> mocked = mockStatic(SecurityUtil.class)) {
            mocked.when(SecurityUtil::getCurrentUserEmail).thenReturn("user@travel.com");
            when(userRepository.findByEmail("user@travel.com")).thenReturn(Optional.of(mockUser));
            when(reviewRepository.save(any())).thenThrow(new RuntimeException("DB connection error"));

            assertThrows(RuntimeException.class, () -> reviewService.createReview(reviewRequest));
        }
    }

    // =========================================================
    // GET SERVICE REVIEWS TESTS
    // =========================================================

    @Test
    @DisplayName("TC05 - Lấy danh sách đánh giá - Statement Coverage")
    void testGetServiceReviews_Success() {
        when(reviewRepository.findByServiceIdAndServiceType("hotel-001", ServiceType.HOTEL))
                .thenReturn(List.of(mockReview));
        when(userRepository.findById("user-001")).thenReturn(Optional.of(mockUser));

        List<ReviewResponse> reviews = reviewService.getServiceReviews("hotel-001", ServiceType.HOTEL);

        assertNotNull(reviews);
        assertEquals(1, reviews.size());
        assertEquals("Nguyen Van B", reviews.get(0).getUserName());
        assertEquals(5, reviews.get(0).getRating());
    }

    @Test
    @DisplayName("TC06 - Lấy đánh giá khi user đã bị xóa (orphaned review) - Branch: user == null")
    void testGetServiceReviews_OrphanedReview_UsesDefaultName() {
        // Branch Coverage: user = null -> sử dụng tên mặc định "Người dùng
        // TravelWithMe"
        when(reviewRepository.findByServiceIdAndServiceType("hotel-001", ServiceType.HOTEL))
                .thenReturn(List.of(mockReview));
        when(userRepository.findById("user-001")).thenReturn(Optional.empty());

        List<ReviewResponse> reviews = reviewService.getServiceReviews("hotel-001", ServiceType.HOTEL);

        assertNotNull(reviews);
        assertEquals(1, reviews.size());
        assertEquals("Người dùng TravelWithMe", reviews.get(0).getUserName(),
                "Khi user bị xóa phải hiển thị tên mặc định");
    }

    @Test
    @DisplayName("TC07 - Lấy đánh giá khi chưa có ai đánh giá - Empty List")
    void testGetServiceReviews_EmptyList() {
        when(reviewRepository.findByServiceIdAndServiceType("hotel-empty", ServiceType.HOTEL))
                .thenReturn(List.of());

        List<ReviewResponse> reviews = reviewService.getServiceReviews("hotel-empty", ServiceType.HOTEL);

        assertNotNull(reviews);
        assertTrue(reviews.isEmpty());
    }

    @Test
    @DisplayName("TC08 - Đánh giá cho TOUR - Branch: ServiceType khác nhau")
    void testGetServiceReviews_TourType() {
        Review tourReview = Review.builder()
                .id("review-003").userId("user-001").serviceId("tour-001")
                .serviceType(ServiceType.TOUR).rating(4).comment("Tour thú vị!")
                .createdAt(LocalDateTime.now()).build();

        when(reviewRepository.findByServiceIdAndServiceType("tour-001", ServiceType.TOUR))
                .thenReturn(List.of(tourReview));
        when(userRepository.findById("user-001")).thenReturn(Optional.of(mockUser));

        List<ReviewResponse> reviews = reviewService.getServiceReviews("tour-001", ServiceType.TOUR);

        assertEquals(1, reviews.size());
        assertEquals(4, reviews.get(0).getRating());
    }
}

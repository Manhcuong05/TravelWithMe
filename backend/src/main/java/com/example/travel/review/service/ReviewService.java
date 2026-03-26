package com.example.travel.review.service;

import com.example.travel.booking.entity.Booking;
import com.example.travel.booking.entity.BookingItem;
import com.example.travel.booking.repository.BookingRepository;
import com.example.travel.catalog.dto.ServiceType;
import com.example.travel.core.exception.BusinessException;
import com.example.travel.core.util.SecurityUtil;
import com.example.travel.identity.entity.User;
import com.example.travel.identity.repository.UserRepository;
import com.example.travel.review.dto.ReviewRequest;
import com.example.travel.review.dto.ReviewResponse;
import com.example.travel.review.entity.Review;
import com.example.travel.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    /**
     * Kiểm tra user có quyền đánh giá tour/dịch vụ chưa:
     * - Phải có booking chứa serviceId đó
     * - checkOutDate (ngày về) phải đã qua
     * - Chưa từng đánh giá service này
     */
    public boolean canUserReview(String serviceId, ServiceType serviceType) {
        String userEmail = SecurityUtil.getCurrentUserEmail();
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) return false;

        // Kiểm tra đã review chưa
        if (reviewRepository.existsByUserIdAndServiceIdAndServiceType(user.getId(), serviceId, serviceType)) {
            return false;
        }

        // Tìm booking hợp lệ:
        // 1. Trạng thái phải là PAID hoặc CONFIRMED (đã thanh toán)
        // 2. checkOutDate (ngày về) phải đã qua hôm nay
        List<Booking> bookings = bookingRepository.findByUserId(user.getId());
        for (Booking booking : bookings) {
            // Chỉ chấp nhận booking đã thanh toán/xác nhận
            if (booking.getStatus() != Booking.BookingStatus.PAID &&
                booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
                continue;
            }
            for (BookingItem item : booking.getItems()) {
                if (item.getServiceId().equals(serviceId) &&
                    item.getServiceType() == serviceType &&
                    item.getCheckOutDate() != null &&
                    !item.getCheckOutDate().isAfter(LocalDate.now())) {
                    return true;
                }
            }
        }
        return false;
    }

    @Transactional
    public ReviewResponse createReview(ReviewRequest request) {
        String userEmail = SecurityUtil.getCurrentUserEmail();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "Người dùng không tồn tại"));

        // Kiểm tra quyền đánh giá (chỉ áp dụng với TOUR)
        if (request.getServiceType() == ServiceType.TOUR) {
            if (!canUserReview(request.getServiceId(), ServiceType.TOUR)) {
                throw new BusinessException("REVIEW_NOT_ALLOWED",
                        "Bạn chỉ có thể đánh giá sau khi hoàn thành chuyến đi, hoặc bạn đã đánh giá tour này rồi.");
            }
        }

        Review review = Review.builder()
                .userId(user.getId())
                .serviceId(request.getServiceId())
                .serviceType(request.getServiceType())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        try {
            Review saved = reviewRepository.save(review);
            return mapToResponse(saved, user.getFullName());
        } catch (Exception e) {
            log.error("Error saving review", e);
            throw e;
        }
    }

    public List<ReviewResponse> getServiceReviews(String serviceId, ServiceType serviceType) {
        try {
            return reviewRepository.findByServiceIdAndServiceType(serviceId, serviceType).stream()
                    .map(review -> {
                        User user = userRepository.findById(review.getUserId()).orElse(null);
                        String userName = user != null ? user.getFullName() : "Người dùng TravelWithMe";
                        return mapToResponse(review, userName);
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching reviews for service: {}, type: {}", serviceId, serviceType, e);
            throw e;
        }
    }

    private ReviewResponse mapToResponse(Review review, String userName) {
        return ReviewResponse.builder()
                .id(review.getId())
                .userName(userName)
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}

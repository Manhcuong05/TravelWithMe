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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse createReview(ReviewRequest request) {
        String userEmail = SecurityUtil.getCurrentUserEmail();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "Người dùng không tồn tại"));

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

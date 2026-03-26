package com.example.travel.review.controller;

import com.example.travel.catalog.dto.ServiceType;
import com.example.travel.core.response.ApiResponse;
import com.example.travel.review.dto.ReviewRequest;
import com.example.travel.review.dto.ReviewResponse;
import com.example.travel.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasAnyRole('TRAVELER', 'CTV', 'ADMIN')")
    public ApiResponse<ReviewResponse> createReview(@Valid @RequestBody ReviewRequest request) {
        return ApiResponse.success(reviewService.createReview(request), "Cảm ơn bạn đã để lại đánh giá!");
    }

    @GetMapping("/service/{serviceId}")
    public ApiResponse<List<ReviewResponse>> getServiceReviews(
            @PathVariable String serviceId,
            @RequestParam ServiceType type) {
        return ApiResponse.success(reviewService.getServiceReviews(serviceId, type));
    }

    /**
     * Kiểm tra user đăng nhập có thể đánh giá tour/dịch vụ này không.
     * Trả về { canReview: true/false }
     */
    @GetMapping("/can-review")
    @PreAuthorize("hasAnyRole('TRAVELER', 'CTV', 'ADMIN')")
    public ApiResponse<Map<String, Boolean>> canReview(
            @RequestParam String serviceId,
            @RequestParam ServiceType serviceType) {
        boolean can = reviewService.canUserReview(serviceId, serviceType);
        return ApiResponse.success(Map.of("canReview", can));
    }
}

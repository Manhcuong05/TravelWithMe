package com.example.travel.interaction.controller;

import com.example.travel.core.response.ApiResponse;
import com.example.travel.interaction.entity.Review;
import com.example.travel.interaction.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasAnyRole('TRAVELER', 'CTV', 'ADMIN')")
    public ApiResponse<Review> postReview(@RequestParam String serviceId,
            @RequestParam int rating,
            @RequestParam(required = false) String comment) {
        return ApiResponse.success(reviewService.addReview(serviceId, rating, comment),
                "Cảm ơn bạn đã đánh giá dịch vụ");
    }

    @GetMapping("/service/{serviceId}")
    public ApiResponse<List<Review>> getReviews(@PathVariable String serviceId) {
        return ApiResponse.success(reviewService.getServiceReviews(serviceId));
    }
}

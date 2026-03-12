package com.example.travel.interaction.service;

import com.example.travel.core.exception.BusinessException;
import com.example.travel.core.util.SecurityUtil;
import com.example.travel.identity.entity.User;
import com.example.travel.identity.repository.UserRepository;
import com.example.travel.interaction.entity.Review;
import com.example.travel.interaction.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public Review addReview(String serviceId, int rating, String comment) {
        String userEmail = SecurityUtil.getCurrentUserEmail();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "Người dùng không tồn tại"));

        if (rating < 1 || rating > 5) {
            throw new BusinessException("INVALID_RATING", "Đánh giá phải từ 1 đến 5 sao");
        }

        Review review = Review.builder()
                .userId(user.getId())
                .serviceId(serviceId)
                .rating(rating)
                .comment(comment)
                .build();

        return reviewRepository.save(review);
    }

    public List<Review> getServiceReviews(String serviceId) {
        return reviewRepository.findByServiceId(serviceId);
    }
}

package com.example.travel.review.repository;

import com.example.travel.review.entity.Review;
import com.example.travel.catalog.dto.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findByServiceIdAndServiceType(String serviceId, ServiceType serviceType);

    List<Review> findByUserId(String userId);
}

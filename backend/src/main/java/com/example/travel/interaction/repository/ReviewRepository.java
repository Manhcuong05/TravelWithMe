package com.example.travel.interaction.repository;

import com.example.travel.interaction.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findByServiceId(String serviceId);
}

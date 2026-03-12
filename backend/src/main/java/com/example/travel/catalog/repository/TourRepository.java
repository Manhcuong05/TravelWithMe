package com.example.travel.catalog.repository;

import com.example.travel.catalog.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, String> {
    List<Tour> findByLocation(String location);
}

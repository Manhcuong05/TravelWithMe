package com.example.travel.catalog.repository;

import com.example.travel.catalog.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, String> {
    List<Hotel> findByCity(String city);
    List<Hotel> findByCityContainingIgnoreCase(String city);
}

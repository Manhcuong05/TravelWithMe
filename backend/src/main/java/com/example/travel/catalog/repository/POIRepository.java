package com.example.travel.catalog.repository;

import com.example.travel.catalog.entity.POI;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface POIRepository extends JpaRepository<POI, String> {
    List<POI> findByCity(String city);
    List<POI> findByCityContainingIgnoreCase(String city);

    List<POI> findByCategory(String category);
}

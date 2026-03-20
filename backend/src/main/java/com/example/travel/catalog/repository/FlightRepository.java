package com.example.travel.catalog.repository;

import com.example.travel.catalog.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, String> {
    List<Flight> findByDepartureCityContainingIgnoreCaseAndArrivalCityContainingIgnoreCase(String departure,
            String arrival);
}

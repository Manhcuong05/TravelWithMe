package com.example.travel.catalog.service;

import com.example.travel.catalog.dto.TourResponse;
import com.example.travel.catalog.entity.Tour;
import com.example.travel.catalog.repository.TourRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TourService {

    private final TourRepository tourRepository;

    public List<TourResponse> searchTours(String location) {
        List<Tour> tours;
        if (location != null && !location.isEmpty()) {
            tours = tourRepository.findByLocation(location);
        } else {
            tours = tourRepository.findAll();
        }

        return tours.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TourResponse mapToResponse(Tour tour) {
        return TourResponse.builder()
                .id(tour.getId())
                .title(tour.getTitle())
                .description(tour.getDescription())
                .location(tour.getLocation())
                .price(tour.getPrice())
                .durationDays(tour.getDurationDays())
                .highlights(tour.getHighlights() != null ? Arrays.asList(tour.getHighlights().split(",")) : null)
                .build();
    }
}

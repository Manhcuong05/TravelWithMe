package com.example.travel.catalog.service;

import com.example.travel.catalog.dto.TourRequest;
import com.example.travel.catalog.dto.TourResponse;
import com.example.travel.catalog.entity.Tour;
import com.example.travel.catalog.repository.TourRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TourService {

    private final TourRepository tourRepository;
    private final ObjectMapper objectMapper;

    public TourResponse saveTour(TourRequest request) {
        Tour tour = Tour.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .price(request.getPrice())
                .durationDays(request.getDurationDays())
                .highlights(request.getHighlights())
                .imagesJson(toJson(request.getImages()))
                .build();
        return mapToResponse(tourRepository.save(tour));
    }

    public TourResponse updateTour(String id, TourRequest request) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tour"));

        tour.setTitle(request.getTitle());
        tour.setDescription(request.getDescription());
        tour.setLocation(request.getLocation());
        tour.setPrice(request.getPrice());
        tour.setDurationDays(request.getDurationDays());
        tour.setHighlights(request.getHighlights());
        tour.setImagesJson(toJson(request.getImages()));

        return mapToResponse(tourRepository.save(tour));
    }

    public void deleteTour(String id) {
        if (!tourRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy tour để xóa");
        }
        tourRepository.deleteById(id);
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            log.error("Error converting object to JSON", e);
            return "[]";
        }
    }

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

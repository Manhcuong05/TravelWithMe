package com.example.travel.catalog.service;

import com.example.travel.catalog.dto.POIResponse;
import com.example.travel.catalog.entity.POI;
import com.example.travel.catalog.repository.POIRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class POIService {

    private final POIRepository poiRepository;

    public List<POIResponse> searchPOIs(String city) {
        List<POI> pois;
        if (city != null && !city.isEmpty()) {
            pois = poiRepository.findByCity(city);
        } else {
            pois = poiRepository.findAll();
        }

        return pois.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private POIResponse mapToResponse(POI poi) {
        return POIResponse.builder()
                .id(poi.getId())
                .name(poi.getName())
                .description(poi.getDescription())
                .category(poi.getCategory())
                .address(poi.getAddress())
                .city(poi.getCity())
                .latitude(poi.getLatitude())
                .longitude(poi.getLongitude())
                .build();
    }
}

package com.example.travel.catalog.service;

import com.example.travel.catalog.dto.POIRequest;
import com.example.travel.catalog.dto.POIResponse;
import com.example.travel.catalog.entity.POI;
import com.example.travel.catalog.repository.POIRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class POIService {

    private final POIRepository poiRepository;
    private final ObjectMapper objectMapper;

    public POIResponse savePOI(POIRequest request) {
        POI poi = POI.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .address(request.getAddress())
                .city(request.getCity())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .imagesJson(toJson(request.getImages()))
                .averageSpend(request.getAverageSpend())
                .build();
        return mapToResponse(poiRepository.save(poi));
    }

    public POIResponse updatePOI(String id, POIRequest request) {
        POI poi = poiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy địa điểm tham quan"));

        poi.setName(request.getName());
        poi.setDescription(request.getDescription());
        poi.setCategory(request.getCategory());
        poi.setAddress(request.getAddress());
        poi.setCity(request.getCity());
        poi.setLatitude(request.getLatitude());
        poi.setLongitude(request.getLongitude());
        poi.setImagesJson(toJson(request.getImages()));
        poi.setAverageSpend(request.getAverageSpend());

        return mapToResponse(poiRepository.save(poi));
    }

    public void deletePOI(String id) {
        if (!poiRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy địa điểm để xóa");
        }
        poiRepository.deleteById(id);
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            log.error("Error converting object to JSON", e);
            return "[]";
        }
    }

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

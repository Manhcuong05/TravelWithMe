package com.example.travel.catalog.controller;

import com.example.travel.catalog.dto.GlobalSearchResponse;
import com.example.travel.catalog.service.FlightService;
import com.example.travel.catalog.service.HotelService;
import com.example.travel.catalog.service.POIService;
import com.example.travel.catalog.service.TourService;
import com.example.travel.core.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final HotelService hotelService;
    private final FlightService flightService;
    private final TourService tourService;
    private final POIService poiService;

    @GetMapping
    public ApiResponse<GlobalSearchResponse> searchAll(@RequestParam String query) {
        return ApiResponse.success(GlobalSearchResponse.builder()
                .hotels(hotelService.searchHotels(query))
                .flights(flightService.searchFlights(query, query)) // Basic matching logic
                .tours(tourService.searchTours(query))
                .pois(poiService.searchPOIs(query))
                .build());
    }
}

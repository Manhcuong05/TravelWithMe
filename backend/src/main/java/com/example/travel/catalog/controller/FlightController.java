package com.example.travel.catalog.controller;

import com.example.travel.catalog.dto.FlightResponse;
import com.example.travel.catalog.service.FlightService;
import com.example.travel.core.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    @GetMapping
    public ApiResponse<List<FlightResponse>> searchFlights(
            @RequestParam(required = false) String departure,
            @RequestParam(required = false) String arrival) {
        return ApiResponse.success(flightService.searchFlights(departure, arrival));
    }
}

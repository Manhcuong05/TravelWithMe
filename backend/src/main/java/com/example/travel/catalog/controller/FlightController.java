package com.example.travel.catalog.controller;

import com.example.travel.catalog.dto.FlightResponse;
import com.example.travel.catalog.service.FlightService;
import com.example.travel.core.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    @GetMapping
    public ApiResponse<List<FlightResponse>> searchFlights(
            @RequestParam(required = false) String departure,
            @RequestParam(required = false) String arrival) {
        return ApiResponse.success(flightService.searchFlights(departure, arrival));
    }

    @GetMapping("/{id}")
    public ApiResponse<FlightResponse> getFlight(@PathVariable String id) {
        return ApiResponse.success(flightService.getFlight(id));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<FlightResponse> createFlight(
            @org.springframework.web.bind.annotation.RequestBody com.example.travel.catalog.dto.FlightRequest request) {
        return ApiResponse.success(flightService.saveFlight(request), "Đã tạo chuyến bay thành công");
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<FlightResponse> updateFlight(@PathVariable String id,
            @org.springframework.web.bind.annotation.RequestBody com.example.travel.catalog.dto.FlightRequest request) {
        return ApiResponse.success(flightService.updateFlight(id, request), "Đã cập nhật chuyến bay thành công");
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<Void> deleteFlight(@PathVariable String id) {
        flightService.deleteFlight(id);
        return ApiResponse.success(null, "Đã xóa chuyến bay thành công");
    }
}

package com.example.travel.catalog.controller;

import com.example.travel.catalog.dto.TourResponse;
import com.example.travel.catalog.service.TourService;
import com.example.travel.core.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tours")
@RequiredArgsConstructor
public class TourController {

    private final TourService tourService;

    @GetMapping
    public ApiResponse<List<TourResponse>> searchTours(@RequestParam(required = false) String location) {
        return ApiResponse.success(tourService.searchTours(location));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<TourResponse> createTour(
            @org.springframework.web.bind.annotation.RequestBody com.example.travel.catalog.dto.TourRequest request) {
        return ApiResponse.success(tourService.saveTour(request), "Đã tạo tour thành công");
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<TourResponse> updateTour(@PathVariable String id,
            @org.springframework.web.bind.annotation.RequestBody com.example.travel.catalog.dto.TourRequest request) {
        return ApiResponse.success(tourService.updateTour(id, request), "Đã cập nhật tour thành công");
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<Void> deleteTour(@PathVariable String id) {
        tourService.deleteTour(id);
        return ApiResponse.success(null, "Đã xóa tour thành công");
    }
}

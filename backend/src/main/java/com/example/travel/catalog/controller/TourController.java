package com.example.travel.catalog.controller;

import com.example.travel.catalog.dto.TourResponse;
import com.example.travel.catalog.service.TourService;
import com.example.travel.core.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tours")
@RequiredArgsConstructor
public class TourController {

    private final TourService tourService;

    @GetMapping
    public ApiResponse<List<TourResponse>> searchTours(@RequestParam(required = false) String location) {
        return ApiResponse.success(tourService.searchTours(location));
    }
}

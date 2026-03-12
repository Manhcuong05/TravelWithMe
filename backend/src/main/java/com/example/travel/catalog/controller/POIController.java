package com.example.travel.catalog.controller;

import com.example.travel.catalog.dto.POIResponse;
import com.example.travel.catalog.service.POIService;
import com.example.travel.core.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pois")
@RequiredArgsConstructor
public class POIController {

    private final POIService poiService;

    @GetMapping
    public ApiResponse<List<POIResponse>> searchPOIs(@RequestParam(required = false) String city) {
        return ApiResponse.success(poiService.searchPOIs(city));
    }
}

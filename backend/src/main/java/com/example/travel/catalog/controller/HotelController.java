package com.example.travel.catalog.controller;

import com.example.travel.catalog.dto.HotelResponse;
import com.example.travel.catalog.service.HotelService;
import com.example.travel.core.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @GetMapping
    public ApiResponse<List<HotelResponse>> searchHotels(@RequestParam(required = false) String city) {
        return ApiResponse.success(hotelService.searchHotels(city));
    }

    @GetMapping("/{id}")
    public ApiResponse<HotelResponse> getHotel(@PathVariable String id) {
        return ApiResponse.success(hotelService.getHotelById(id));
    }
}

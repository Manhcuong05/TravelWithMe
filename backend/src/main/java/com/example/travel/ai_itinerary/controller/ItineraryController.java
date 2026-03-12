package com.example.travel.ai_itinerary.controller;

import com.example.travel.ai_itinerary.entity.Itinerary;
import com.example.travel.ai_itinerary.service.ItineraryService;
import com.example.travel.core.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/itineraries")
@RequiredArgsConstructor
public class ItineraryController {

    private final ItineraryService itineraryService;

    @PostMapping("/generate")
    public ApiResponse<Itinerary> generate(@RequestParam String destination,
            @RequestParam int days,
            @RequestParam(required = false) String preferences) {
        return ApiResponse.success(itineraryService.createItinerary(destination, days, preferences),
                "Đã tạo lịch trình AI thành công");
    }

    @GetMapping("/my")
    public ApiResponse<List<Itinerary>> getMyItineraries() {
        return ApiResponse.success(itineraryService.getUserItineraries());
    }
}

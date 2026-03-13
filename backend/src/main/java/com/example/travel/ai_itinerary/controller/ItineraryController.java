package com.example.travel.ai_itinerary.controller;

import com.example.travel.ai_itinerary.dto.ItineraryRequest;
import com.example.travel.ai_itinerary.dto.ItineraryResponse;
import com.example.travel.ai_itinerary.service.ItineraryService;
import com.example.travel.core.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/itineraries")
@RequiredArgsConstructor
public class ItineraryController {

    private final ItineraryService itineraryService;

    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('TRAVELER', 'CTV', 'ADMIN')")
    public ApiResponse<ItineraryResponse> generate(@RequestBody ItineraryRequest request) {
        return ApiResponse.success(
                itineraryService.createItinerary(request.getDestination(), request.getDays(), request.getPreferences()),
                "Đã tạo lịch trình AI thành công");
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('TRAVELER', 'CTV', 'ADMIN')")
    public ApiResponse<List<ItineraryResponse>> getMyItineraries() {
        return ApiResponse.success(itineraryService.getUserItineraries());
    }
}

package com.example.travel.catalog.controller;

import com.example.travel.catalog.dto.FavoriteRequest;
import com.example.travel.catalog.service.FavoriteService;
import com.example.travel.ai_itinerary.service.ItineraryService;
import com.example.travel.core.response.ApiResponse;
import com.example.travel.identity.entity.User;
import com.example.travel.identity.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final ItineraryService itineraryService;
    private final AuthService authService;

    @PostMapping("/toggle")
    public ApiResponse<Void> toggleFavorite(@RequestBody FavoriteRequest request) {
        User user = authService.getCurrentUser();
        favoriteService.toggleFavorite(user.getId(), request);
        return ApiResponse.success(null, "Đã cập nhật danh sách yêu thích");
    }

    @GetMapping("/status")
    public ApiResponse<Boolean> getFavoriteStatus(@RequestParam String type, @RequestParam String id) {
        User user = authService.getCurrentUser();
        return ApiResponse.success(favoriteService.isFavorite(user.getId(), type, id));
    }

    @GetMapping("/all")
    public ApiResponse<Map<String, Object>> getAllFavorites() {
        User user = authService.getCurrentUser();
        return ApiResponse.success(Map.of(
            "tours", favoriteService.getFavoriteTours(user.getId()),
            "hotels", favoriteService.getFavoriteHotels(user.getId()),
            "pois", favoriteService.getFavoritePOIs(user.getId()),
            "itineraries", itineraryService.getUserItineraries()
        ));
    }
}

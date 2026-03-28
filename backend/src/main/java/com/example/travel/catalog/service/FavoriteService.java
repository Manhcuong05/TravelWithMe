package com.example.travel.catalog.service;

import com.example.travel.catalog.dto.*;
import com.example.travel.catalog.entity.Favorite;
import com.example.travel.catalog.repository.*;
import com.example.travel.ai_itinerary.repository.ItineraryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final TourService tourService;
    private final HotelService hotelService;
    private final POIService poiService;
    private final ItineraryRepository itineraryRepository;

    @Transactional
    public void toggleFavorite(String userId, FavoriteRequest request) {
        if (favoriteRepository.existsByUserIdAndItemTypeAndItemId(userId, request.getItemType(), request.getItemId())) {
            favoriteRepository.deleteByUserIdAndItemTypeAndItemId(userId, request.getItemType(), request.getItemId());
            
            // Special handling for legacy ITINERARY "saved" flag
            if ("ITINERARY".equals(request.getItemType())) {
                itineraryRepository.findById(request.getItemId()).ifPresent(it -> {
                    it.setSaved(false);
                    itineraryRepository.save(it);
                });
            }
        } else {
            Favorite favorite = Favorite.builder()
                    .userId(userId)
                    .itemType(request.getItemType())
                    .itemId(request.getItemId())
                    .build();
            favoriteRepository.save(favorite);

            // Special handling for legacy ITINERARY "saved" flag
            if ("ITINERARY".equals(request.getItemType())) {
                itineraryRepository.findById(request.getItemId()).ifPresent(it -> {
                    it.setSaved(true);
                    itineraryRepository.save(it);
                });
            }
        }
    }

    public List<TourResponse> getFavoriteTours(String userId) {
        List<Favorite> favorites = favoriteRepository.findByUserIdAndItemType(userId, "TOUR");
        return favorites.stream()
                .map(f -> tourService.getTourById(f.getItemId()))
                .collect(Collectors.toList());
    }

    public List<HotelResponse> getFavoriteHotels(String userId) {
        List<Favorite> favorites = favoriteRepository.findByUserIdAndItemType(userId, "HOTEL");
        return favorites.stream()
                .map(f -> hotelService.getHotelById(f.getItemId()))
                .collect(Collectors.toList());
    }

    public List<POIResponse> getFavoritePOIs(String userId) {
        List<Favorite> favorites = favoriteRepository.findByUserIdAndItemType(userId, "POI");
        return favorites.stream()
                .map(f -> poiService.getPOIById(f.getItemId()))
                .collect(Collectors.toList());
    }

    public boolean isFavorite(String userId, String itemType, String itemId) {
        return favoriteRepository.existsByUserIdAndItemTypeAndItemId(userId, itemType, itemId);
    }
}

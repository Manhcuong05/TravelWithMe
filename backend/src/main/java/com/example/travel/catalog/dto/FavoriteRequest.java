package com.example.travel.catalog.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteRequest {
    private String itemType; // TOUR, HOTEL, POI, ITINERARY
    private String itemId;
}

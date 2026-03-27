package com.example.travel.catalog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TourResponse {
    private String id;
    private String title;
    private String tourType;
    private String description;
    private String location;
    private double price;
    private int durationDays;
    private List<String> highlights;

    // Combo Details
    private String hotelId;
    private String flightId;
    private List<String> poiIds;
    private String aiSuggestions;

    // Tọa độ địa lý
    private Double latitude;
    private Double longitude;
    private String streetViewUrl;
    private String imageUrl;
}

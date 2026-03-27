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
public class HotelResponse {
    private String id;
    private String name;
    private String description;
    private String address;
    private String city;
    private double rating;
    private int starRating;
    private List<String> images;
    private List<HotelRoomResponse> rooms;

    // Additional fields for detail view & management
    private Double latitude;
    private Double longitude;
    private String streetViewUrl;
    private String imageUrl;
}

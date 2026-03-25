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
public class HotelRoomResponse {
    private String id;
    private String roomType;
    private double pricePerNight;
    private int capacity;
    private int totalRooms;
    private int availableRooms;
    private List<String> amenities;
    private String classification;
}

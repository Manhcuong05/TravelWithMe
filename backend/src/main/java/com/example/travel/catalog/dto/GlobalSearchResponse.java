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
public class GlobalSearchResponse {
    private List<HotelResponse> hotels;
    private List<FlightResponse> flights;
    private List<TourResponse> tours;
    private List<POIResponse> pois;
}

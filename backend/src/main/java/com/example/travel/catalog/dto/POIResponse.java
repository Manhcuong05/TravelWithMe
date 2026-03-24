package com.example.travel.catalog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class POIResponse {
    private String id;
    private String name;
    private String description;
    private String category;
    private String address;
    private String city;
    private double latitude;
    private double longitude;

    private String region;
    private String bestTimeToVisit;
    private String tips;
    private Double rating;
    private double averageSpend;
    private String imagesJson;
    private String handbookJson;
}

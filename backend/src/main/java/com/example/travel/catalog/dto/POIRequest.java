package com.example.travel.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class POIRequest {

    @NotBlank(message = "Tên địa điểm không được để trống")
    private String name;

    private String description;
    private String category;
    private String address;
    private String city;

    private double latitude;
    private double longitude;

    private List<String> images;
    private double averageSpend;
}

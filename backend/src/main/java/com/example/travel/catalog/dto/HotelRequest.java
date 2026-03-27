package com.example.travel.catalog.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class HotelRequest {

    @NotBlank(message = "Tên khách sạn không được để trống")
    private String name;

    private String description;
    private String address;
    private String city;
    private String country;

    @Min(value = 1, message = "Star rating tối thiểu là 1")
    @Max(value = 5, message = "Star rating tối đa là 5")
    private int starRating;

    private List<String> images;

    // Tọa độ địa lý
    private Double latitude;
    private Double longitude;
    private String streetViewUrl;
}

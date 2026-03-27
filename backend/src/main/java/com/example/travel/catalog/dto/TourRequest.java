package com.example.travel.catalog.dto;

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
public class TourRequest {

    @NotBlank(message = "Tiêu đề tour không được để trống")
    private String title;

    private String tourType;
    private String description;
    private String location;

    @Min(value = 0, message = "Giá tour không được nhỏ hơn 0")
    private double price;

    @Min(value = 1, message = "Số ngày tour tối thiểu là 1")
    private int durationDays;

    private String highlights;
    private List<String> images;

    // Tọa độ địa lý
    private Double latitude;
    private Double longitude;
    private String streetViewUrl;
}

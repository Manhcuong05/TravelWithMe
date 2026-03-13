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
public class HotelRoomRequest {

    @NotBlank(message = "Loại phòng không được để trống")
    private String roomType;

    @Min(value = 0, message = "Giá phòng không được nhỏ hơn 0")
    private double pricePerNight;

    @Min(value = 1, message = "Sức chứa tối thiểu là 1 người")
    private int capacity;

    private int totalRooms;
    private List<String> amenities;
}

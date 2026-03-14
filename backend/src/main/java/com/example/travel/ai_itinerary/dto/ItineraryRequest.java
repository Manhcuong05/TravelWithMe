package com.example.travel.ai_itinerary.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryRequest {
    @NotBlank(message = "Điểm đến không được để trống")
    private String destination;

    @Min(value = 1, message = "Số ngày phải ít nhất là 1")
    private int days;

    private String preferences;
}

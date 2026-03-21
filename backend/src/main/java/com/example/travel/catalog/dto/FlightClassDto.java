package com.example.travel.catalog.dto;

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
public class FlightClassDto {
    private String id;

    @NotBlank(message = "Tên hạng vé không được để trống")
    private String className;

    @Min(value = 0, message = "Giá người lớn không hợp lệ")
    private double priceAdult;

    @Min(value = 0, message = "Giá trẻ em không hợp lệ")
    private double priceChild;

    @Min(value = 0, message = "Giá em bé không hợp lệ")
    private double priceInfant;

    @Min(value = 1, message = "Tổng số ghế phải lớn hơn 0")
    private int totalSeats;

    private int availableSeats;

    private int baggageAllowanceKg;
}

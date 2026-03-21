package com.example.travel.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightRequest {

    @NotBlank(message = "Số hiệu chuyến bay không được để trống")
    private String flightNumber;

    @NotBlank(message = "Hãng hàng không không được để trống")
    private String airline;

    private String departureCity;
    private String arrivalCity;
    private String departureAirport;
    private String arrivalAirport;

    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;

    private java.util.List<FlightClassDto> flightClasses;

    private String aircraft;
}

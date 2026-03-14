package com.example.travel.booking.dto;

import com.example.travel.booking.entity.Booking;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private String id;
    private double totalAmount;
    private Booking.BookingStatus status;
    private LocalDateTime createdAt;
    private List<ItemResponse> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemResponse {
        private String serviceId;
        private String serviceType;
        private int quantity;
        private double price;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;
    }
}

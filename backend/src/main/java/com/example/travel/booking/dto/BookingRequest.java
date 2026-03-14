package com.example.travel.booking.dto;

import com.example.travel.catalog.dto.ServiceType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    @NotEmpty(message = "Danh sách mục đặt chỗ không được để trống")
    private List<@Valid ItemRequest> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemRequest {
        private ServiceType type;
        @NotBlank(message = "ID dịch vụ không được để trống")
        private String serviceId;
        @Min(value = 1, message = "Số lượng phải ít nhất là 1")
        private int quantity;

        private LocalDate checkInDate;
        private LocalDate checkOutDate;
    }
}

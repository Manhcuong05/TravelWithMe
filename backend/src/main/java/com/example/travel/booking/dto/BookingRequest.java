package com.example.travel.booking.dto;

import com.example.travel.catalog.dto.ServiceType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
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

    @Valid
    private ContactRequest contact;

    @Valid
    private List<@Valid PassengerRequest> passengers;

    private AddonRequest addons;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContactRequest {
        @NotBlank(message = "Tên liên hệ không được để trống")
        private String name;

        @NotBlank(message = "Số điện thoại không được để trống")
        private String phone;

        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        private String email;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PassengerRequest {
        @NotBlank(message = "Danh xưng không được để trống")
        private String title;

        @NotBlank(message = "Họ không được để trống")
        private String lastName;

        @NotBlank(message = "Tên không được để trống")
        private String firstName;

        private String dob; // can parse to LocalDate on mapping if needed, or leave missing temporarily

        @NotBlank(message = "Quốc tịch không được để trống")
        private String nationality;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddonRequest {
        private int baggage;
        private boolean meals;
        private boolean seat;
        private boolean insurance;
    }

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

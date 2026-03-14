package com.example.travel.booking.controller;

import com.example.travel.booking.dto.BookingRequest;
import com.example.travel.booking.dto.BookingResponse;
import com.example.travel.booking.service.BookingService;
import com.example.travel.core.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasAnyRole('TRAVELER', 'CTV', 'ADMIN')")
    public ApiResponse<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        return ApiResponse.success(bookingService.createBooking(request),
                "Tạo đơn hàng thành công. Vui lòng thanh toán.");
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TRAVELER', 'CTV', 'ADMIN')")
    public ApiResponse<java.util.List<BookingResponse>> getMyBookings() {
        return ApiResponse.success(bookingService.getUserBookings());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRAVELER', 'CTV', 'ADMIN')")
    public ApiResponse<BookingResponse> getBookingDetail(@PathVariable String id) {
        return ApiResponse.success(bookingService.getBooking(id));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('TRAVELER', 'CTV', 'ADMIN')")
    public ApiResponse<BookingResponse> cancelBooking(@PathVariable String id) {
        return ApiResponse.success(bookingService.cancelBooking(id), "Đã hủy đơn hàng thành công");
    }
}

package com.example.travel.booking.controller;

import com.example.travel.booking.dto.BookingRequest;
import com.example.travel.booking.dto.BookingResponse;
import com.example.travel.booking.service.BookingService;
import com.example.travel.core.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ApiResponse<BookingResponse> createBooking(@RequestBody BookingRequest request) {
        return ApiResponse.success(bookingService.createBooking(request),
                "Tạo đơn hàng thành công. Vui lòng thanh toán.");
    }

    @PostMapping("/{id}/cancel")
    public ApiResponse<BookingResponse> cancelBooking(@PathVariable String id) {
        return ApiResponse.success(bookingService.cancelBooking(id), "Đã hủy đơn hàng thành công");
    }
}

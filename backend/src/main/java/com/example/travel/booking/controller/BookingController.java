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

    // --- ADMIN / CTV ENDPOINTS ---

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<java.util.List<BookingResponse>> getAllBookings() {
        return ApiResponse.success(bookingService.getAllBookings());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<BookingResponse> updateBookingStatus(
            @PathVariable String id, 
            @RequestBody java.util.Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.trim().isEmpty()) {
            throw new com.example.travel.core.exception.BusinessException("INVALID_STATUS", "Trạng thái không được để trống");
        }
        return ApiResponse.success(
            bookingService.updateBookingStatus(id, status), 
            "Cập nhật trạng thái đơn hàng thành công"
        );
    }
}

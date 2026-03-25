package com.example.travel.payment.controller;

import com.example.travel.core.response.ApiResponse;
import com.example.travel.core.service.EmailService;
import com.example.travel.payment.dto.PaymentInitResponse;
import com.example.travel.payment.service.PaymentService;
import com.example.travel.booking.entity.Booking;
import com.example.travel.identity.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final EmailService emailService;

    @PostMapping("/init/{bookingId}")
    @PreAuthorize("hasAnyRole('TRAVELER', 'CTV', 'ADMIN')")
    public ApiResponse<PaymentInitResponse> initPayment(@PathVariable String bookingId) {
        return ApiResponse.success(paymentService.initializePayment(bookingId), "Vui lòng quét mã QR để thanh toán");
    }

    // Mock Webhook endpoint for simulation
    @PostMapping("/webhook/simulate-success")
    public ApiResponse<Void> simulateSuccess(@RequestParam String reference) {
        paymentService.processPaymentSuccess(reference);
        return ApiResponse.success(null, "Giả lập thanh toán thành công");
    }

    // Test email endpoint - DEV only
    @PostMapping("/test-email")
    public ApiResponse<Void> testEmail(@RequestParam String toEmail) {
        Booking mockBooking = Booking.builder()
                .id("test-booking-12345678")
                .totalAmount(5_900_000)
                .status(Booking.BookingStatus.CONFIRMED)
                .items(new ArrayList<>())
                .build();

        User mockUser = User.builder()
                .email(toEmail)
                .fullName("Khách Hàng Test")
                .build();

        emailService.sendBookingConfirmation(mockBooking, mockUser);
        return ApiResponse.success(null, "Email test đã được gửi tới " + toEmail);
    }
}

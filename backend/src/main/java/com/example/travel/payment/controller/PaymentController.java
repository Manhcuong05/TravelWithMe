package com.example.travel.payment.controller;

import com.example.travel.core.response.ApiResponse;
import com.example.travel.payment.dto.PaymentInitResponse;
import com.example.travel.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

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
}

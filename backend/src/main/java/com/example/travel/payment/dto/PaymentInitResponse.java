package com.example.travel.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentInitResponse {
    private String bookingId;
    private double amount;
    private String qrCodeUrl;
    private String paymentReference;
}

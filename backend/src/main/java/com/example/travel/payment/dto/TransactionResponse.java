package com.example.travel.payment.dto;

import com.example.travel.payment.entity.Transaction.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private String id;
    private String bookingId;
    private double amount;
    private String paymentMethod;
    private String transactionReference;
    private TransactionStatus status;
    private LocalDateTime createdAt;
}

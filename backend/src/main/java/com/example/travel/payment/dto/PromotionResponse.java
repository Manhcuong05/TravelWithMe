package com.example.travel.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromotionResponse {
    private String id;
    private String code;
    private String description;
    private double discountPercent;
    private double maxDiscountAmount;
    private LocalDateTime validFrom;
    private LocalDateTime validTo;
    private int usageLimit;
    private int usedCount;
    private boolean active;
}

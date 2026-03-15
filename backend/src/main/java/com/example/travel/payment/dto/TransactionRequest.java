package com.example.travel.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {

    @NotBlank(message = "Mã đơn hàng không được để trống")
    private String bookingId;

    @Positive(message = "Số tiền thanh toán phải lớn hơn 0")
    private double amount;

    @NotBlank(message = "Phương thức thanh toán không được để trống")
    private String paymentMethod;
}

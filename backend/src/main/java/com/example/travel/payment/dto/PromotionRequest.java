package com.example.travel.payment.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromotionRequest {

    @NotBlank(message = "Mã khuyến mãi không được để trống")
    private String code;

    private String description;

    @Min(value = 0, message = "Phần trăm giảm giá phải lớn hơn hoặc bằng 0")
    private double discountPercent; // e.g. 10 for 10%

    @Min(value = 0, message = "Số tiền giảm tối đa phải lớn hơn hoặc bằng 0")
    private double maxDiscountAmount;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDateTime validFrom;

    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDateTime validTo;

    @Min(value = 0, message = "Giới hạn sử dụng phải từ 0 trở lên")
    private int usageLimit;

    @Builder.Default
    private boolean active = true;
}

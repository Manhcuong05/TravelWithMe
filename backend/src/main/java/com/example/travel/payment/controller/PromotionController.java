package com.example.travel.payment.controller;

import com.example.travel.core.response.ApiResponse;
import com.example.travel.payment.dto.PromotionRequest;
import com.example.travel.payment.dto.PromotionResponse;
import com.example.travel.payment.service.PromotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<List<PromotionResponse>> getAllPromotions() {
        return ApiResponse.success(promotionService.getAllPromotions(), "Lấy danh sách mã khuyến mãi thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<PromotionResponse> getPromotion(@PathVariable String id) {
        return ApiResponse.success(promotionService.getPromotion(id), "Lấy chi tiết mã thông tin mã khuyến mãi");
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<PromotionResponse> createPromotion(@Valid @RequestBody PromotionRequest request) {
        return ApiResponse.success(promotionService.createPromotion(request), "Tạo mã khuyến mãi thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<PromotionResponse> updatePromotion(@PathVariable String id,
            @Valid @RequestBody PromotionRequest request) {
        return ApiResponse.success(promotionService.updatePromotion(id, request), "Cập nhật mã khuyến mãi thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<Void> deletePromotion(@PathVariable String id) {
        promotionService.deletePromotion(id);
        return ApiResponse.success(null, "Xóa mã khuyến mãi thành công");
    }

    @PostMapping("/apply")
    public ApiResponse<Void> applyPromotion(@RequestBody Map<String, String> request) {
        String bookingId = request.get("bookingId");
        String promoCode = request.get("promoCode");
        promotionService.applyPromotion(bookingId, promoCode);
        return ApiResponse.success(null, "Áp dụng mã khuyến mãi thành công");
    }
}

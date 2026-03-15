package com.example.travel.payment.service;

import com.example.travel.booking.entity.Booking;
import com.example.travel.booking.repository.BookingRepository;
import com.example.travel.core.exception.BusinessException;
import com.example.travel.payment.dto.PromotionRequest;
import com.example.travel.payment.dto.PromotionResponse;
import com.example.travel.payment.entity.Promotion;
import com.example.travel.payment.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public void applyPromotion(String bookingId, String promoCode) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BusinessException("BOOKING_NOT_FOUND", "Không tìm thấy đơn hàng"));

        Promotion promotion = promotionRepository.findByCode(promoCode)
                .orElseThrow(() -> new BusinessException("PROMO_NOT_FOUND", "Mã giảm giá không hợp lệ"));

        validatePromotion(promotion);

        double discount = (booking.getTotalAmount() * promotion.getDiscountPercent()) / 100;
        if (discount > promotion.getMaxDiscountAmount()) {
            discount = promotion.getMaxDiscountAmount();
        }

        booking.setTotalAmount(booking.getTotalAmount() - discount);
        promotion.setUsedCount(promotion.getUsedCount() + 1);

        bookingRepository.save(booking);
        promotionRepository.save(promotion);
    }

    @Transactional(readOnly = true)
    public List<PromotionResponse> getAllPromotions() {
        return promotionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PromotionResponse getPromotion(String id) {
        return promotionRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new BusinessException("PROMO_NOT_FOUND", "Không tìm thấy mã khuyến mãi"));
    }

    @Transactional
    public PromotionResponse createPromotion(PromotionRequest request) {
        if (promotionRepository.findByCode(request.getCode()).isPresent()) {
            throw new BusinessException("PROMO_CODE_EXISTS", "Mã khuyến mãi đã tồn tại");
        }

        Promotion promotion = Promotion.builder()
                .code(request.getCode())
                .description(request.getDescription())
                .discountPercent(request.getDiscountPercent())
                .maxDiscountAmount(request.getMaxDiscountAmount())
                .validFrom(request.getValidFrom())
                .validTo(request.getValidTo())
                .usageLimit(request.getUsageLimit())
                .active(request.isActive())
                .usedCount(0)
                .build();

        return mapToResponse(promotionRepository.save(promotion));
    }

    @Transactional
    public PromotionResponse updatePromotion(String id, PromotionRequest request) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("PROMO_NOT_FOUND", "Không tìm thấy mã khuyến mãi"));

        // Check if code changes and if the new code already exists
        if (!promotion.getCode().equals(request.getCode()) &&
                promotionRepository.findByCode(request.getCode()).isPresent()) {
            throw new BusinessException("PROMO_CODE_EXISTS", "Mã khuyến mãi đã tồn tại");
        }

        promotion.setCode(request.getCode());
        promotion.setDescription(request.getDescription());
        promotion.setDiscountPercent(request.getDiscountPercent());
        promotion.setMaxDiscountAmount(request.getMaxDiscountAmount());
        promotion.setValidFrom(request.getValidFrom());
        promotion.setValidTo(request.getValidTo());
        promotion.setUsageLimit(request.getUsageLimit());
        promotion.setActive(request.isActive());

        return mapToResponse(promotionRepository.save(promotion));
    }

    @Transactional
    public void deletePromotion(String id) {
        if (!promotionRepository.existsById(id)) {
            throw new BusinessException("PROMO_NOT_FOUND", "Không tìm thấy mã khuyến mãi");
        }
        promotionRepository.deleteById(id);
    }

    private PromotionResponse mapToResponse(Promotion promotion) {
        return PromotionResponse.builder()
                .id(promotion.getId())
                .code(promotion.getCode())
                .description(promotion.getDescription())
                .discountPercent(promotion.getDiscountPercent())
                .maxDiscountAmount(promotion.getMaxDiscountAmount())
                .validFrom(promotion.getValidFrom())
                .validTo(promotion.getValidTo())
                .usageLimit(promotion.getUsageLimit())
                .usedCount(promotion.getUsedCount())
                .active(promotion.isActive())
                .build();
    }

    private void validatePromotion(Promotion promotion) {
        if (!promotion.isActive()) {
            throw new BusinessException("PROMO_INACTIVE", "Mã giảm giá đã bị tạm ngừng");
        }
        if (promotion.getValidFrom().isAfter(LocalDateTime.now())) {
            throw new BusinessException("PROMO_NOT_STARTED", "Mã giảm giá chưa đến hạn sử dụng");
        }
        if (promotion.getValidTo().isBefore(LocalDateTime.now())) {
            throw new BusinessException("PROMO_EXPIRED", "Mã giảm giá đã hết hạn");
        }
        if (promotion.getUsageLimit() > 0 && promotion.getUsedCount() >= promotion.getUsageLimit()) {
            throw new BusinessException("PROMO_LIMIT_REACHED", "Mã giảm giá đã hết lượt sử dụng");
        }
    }
}

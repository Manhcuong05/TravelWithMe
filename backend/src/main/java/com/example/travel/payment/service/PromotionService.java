package com.example.travel.payment.service;

import com.example.travel.booking.entity.Booking;
import com.example.travel.booking.repository.BookingRepository;
import com.example.travel.core.exception.BusinessException;
import com.example.travel.payment.entity.Promotion;
import com.example.travel.payment.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

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

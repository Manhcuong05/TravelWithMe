package com.example.travel.payment.service;

import com.example.travel.booking.entity.Booking;
import com.example.travel.booking.repository.BookingRepository;
import com.example.travel.core.exception.BusinessException;
import com.example.travel.payment.entity.Promotion;
import com.example.travel.payment.repository.PromotionRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PromotionServiceTest {

    @Mock
    private PromotionRepository promotionRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private PromotionService promotionService;

    private Booking booking;
    private Promotion promotion;

    @BeforeEach
    void setUp() {

        // Khởi tạo booking mẫu
        booking = new Booking();
        booking.setId("B001");
        booking.setTotalAmount(1000000);

        // Khởi tạo promotion mẫu hợp lệ
        promotion = new Promotion();
        promotion.setCode("PROMO10");
        promotion.setDiscountPercent(10);
        promotion.setMaxDiscountAmount(200000);
        promotion.setActive(true);
        promotion.setUsageLimit(10);
        promotion.setUsedCount(0);
        promotion.setValidFrom(LocalDateTime.now().minusDays(1));
        promotion.setValidTo(LocalDateTime.now().plusDays(1));
    }

    // ===== TEST: BOOKING NOT FOUND =====

    @Test
    void applyPromotion_BookingNotFound_ShouldThrowException() {

        // Trường hợp: booking không tồn tại trong database
        when(bookingRepository.findById("B001")).thenReturn(Optional.empty());

        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> promotionService.applyPromotion("B001", "PROMO10")
        );

        assertEquals("BOOKING_NOT_FOUND", ex.getCode());
    }

    // ===== TEST: PROMOTION NOT FOUND =====

    @Test
    void applyPromotion_PromotionNotFound_ShouldThrowException() {

        // Trường hợp: mã giảm giá không tồn tại
        when(bookingRepository.findById("B001")).thenReturn(Optional.of(booking));
        when(promotionRepository.findByCode("PROMO10")).thenReturn(Optional.empty());

        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> promotionService.applyPromotion("B001", "PROMO10")
        );

        assertEquals("PROMO_NOT_FOUND", ex.getCode());
    }

    // ===== TEST: PROMOTION INACTIVE =====

    @Test
    void applyPromotion_PromotionInactive_ShouldThrowException() {

        // Trường hợp: mã giảm giá bị tạm ngừng
        promotion.setActive(false);

        when(bookingRepository.findById("B001")).thenReturn(Optional.of(booking));
        when(promotionRepository.findByCode("PROMO10")).thenReturn(Optional.of(promotion));

        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> promotionService.applyPromotion("B001", "PROMO10")
        );

        assertEquals("PROMO_INACTIVE", ex.getCode());
    }

    // ===== TEST: PROMOTION NOT STARTED =====

    @Test
    void applyPromotion_PromotionNotStarted_ShouldThrowException() {

        // Trường hợp: mã giảm giá chưa tới ngày sử dụng
        promotion.setValidFrom(LocalDateTime.now().plusDays(1));

        when(bookingRepository.findById("B001")).thenReturn(Optional.of(booking));
        when(promotionRepository.findByCode("PROMO10")).thenReturn(Optional.of(promotion));

        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> promotionService.applyPromotion("B001", "PROMO10")
        );

        assertEquals("PROMO_NOT_STARTED", ex.getCode());
    }

    // ===== TEST: PROMOTION EXPIRED =====

    @Test
    void applyPromotion_PromotionExpired_ShouldThrowException() {

        // Trường hợp: mã giảm giá đã hết hạn
        promotion.setValidTo(LocalDateTime.now().minusDays(1));

        when(bookingRepository.findById("B001")).thenReturn(Optional.of(booking));
        when(promotionRepository.findByCode("PROMO10")).thenReturn(Optional.of(promotion));

        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> promotionService.applyPromotion("B001", "PROMO10")
        );

        assertEquals("PROMO_EXPIRED", ex.getCode());
    }

    // ===== TEST: PROMOTION LIMIT REACHED =====

    @Test
    void applyPromotion_PromotionUsageLimitReached_ShouldThrowException() {

        // Trường hợp: mã giảm giá đã đạt giới hạn sử dụng
        promotion.setUsageLimit(5);
        promotion.setUsedCount(5);

        when(bookingRepository.findById("B001")).thenReturn(Optional.of(booking));
        when(promotionRepository.findByCode("PROMO10")).thenReturn(Optional.of(promotion));

        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> promotionService.applyPromotion("B001", "PROMO10")
        );

        assertEquals("PROMO_LIMIT_REACHED", ex.getCode());
    }

    // ===== TEST: APPLY PROMOTION SUCCESS =====

    @Test
    void applyPromotion_ValidPromotion_ShouldApplyDiscount() {

        // Trường hợp: mã giảm giá hợp lệ
        when(bookingRepository.findById("B001")).thenReturn(Optional.of(booking));
        when(promotionRepository.findByCode("PROMO10")).thenReturn(Optional.of(promotion));

        promotionService.applyPromotion("B001", "PROMO10");

        // Discount = 10% của 1,000,000 = 100,000
        assertEquals(900000, booking.getTotalAmount());

        // Used count tăng lên
        assertEquals(1, promotion.getUsedCount());

        verify(bookingRepository).save(booking);
        verify(promotionRepository).save(promotion);
    }

    // ===== TEST: DISCOUNT EXCEEDS MAX LIMIT =====

    @Test
    void applyPromotion_DiscountExceedsMax_ShouldCapDiscount() {

        // Trường hợp: số tiền giảm vượt quá maxDiscountAmount
        promotion.setDiscountPercent(50); // 50% của 1,000,000 = 500,000
        promotion.setMaxDiscountAmount(200000); // max chỉ cho phép 200k

        when(bookingRepository.findById("B001")).thenReturn(Optional.of(booking));
        when(promotionRepository.findByCode("PROMO10")).thenReturn(Optional.of(promotion));

        promotionService.applyPromotion("B001", "PROMO10");

        // chỉ giảm tối đa 200k
        assertEquals(800000, booking.getTotalAmount());

        verify(bookingRepository).save(booking);
        verify(promotionRepository).save(promotion);
    }
}
package com.example.travel.payment.service;

import com.example.travel.booking.entity.Booking;
import com.example.travel.booking.repository.BookingRepository;
import com.example.travel.core.constant.Role;
import com.example.travel.core.exception.BusinessException;
import com.example.travel.core.util.SecurityUtil;
import com.example.travel.identity.entity.User;
import com.example.travel.identity.repository.UserRepository;
import com.example.travel.payment.dto.PaymentInitResponse;
import com.example.travel.payment.entity.Transaction;
import com.example.travel.payment.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * KIỂM THỬ HỘP TRẮNG - PaymentService
 *
 * Kỹ thuật áp dụng:
 * - Branch Coverage: Kiểm tra tất cả nhánh của điều kiện booking status và
 * quyền truy cập
 * - Path Testing: Luồng initializePayment và processPaymentSuccess
 * - Exception Testing: BOOKING_NOT_FOUND, INVALID_BOOKING_STATUS,
 * ACCESS_DENIED, TRANSACTION_NOT_FOUND
 * - Idempotency Test: processPaymentSuccess không xử lý lại nếu đã SUCCESS
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("PaymentService - Kiểm thử hộp trắng")
public class PaymentServiceTest {

    @Mock
    private BookingRepository bookingRepository;
    @Mock
    private TransactionRepository transactionRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PaymentService paymentService;

    private User mockUser;
    private Booking mockBooking;
    private Transaction mockTransaction;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id("user-001").email("user@travel.com").role(Role.TRAVELER)
                .build();

        mockBooking = Booking.builder()
                .id("booking-001")
                .userId("user-001")
                .status(Booking.BookingStatus.AWAITING_PAYMENT)
                .totalAmount(2000000.0)
                .items(new ArrayList<>())
                .build();

        mockTransaction = Transaction.builder()
                .id("trans-001")
                .bookingId("booking-001")
                .amount(2000000.0)
                .paymentMethod("VietQR")
                .transactionReference("TRV123456")
                .status(Transaction.TransactionStatus.PENDING)
                .build();
    }

    // =========================================================
    // INITIALIZE PAYMENT TESTS
    // =========================================================

    @Test
    @DisplayName("TC01 - Khởi tạo thanh toán thành công - Statement Coverage")
    void testInitializePayment_Success() {
        try (MockedStatic<SecurityUtil> mocked = mockStatic(SecurityUtil.class)) {
            mocked.when(SecurityUtil::getCurrentUserEmail).thenReturn("user@travel.com");
            when(bookingRepository.findById("booking-001")).thenReturn(Optional.of(mockBooking));
            when(userRepository.findByEmail("user@travel.com")).thenReturn(Optional.of(mockUser));
            when(transactionRepository.save(any(Transaction.class))).thenReturn(mockTransaction);
            when(bookingRepository.save(any(Booking.class))).thenReturn(mockBooking);

            PaymentInitResponse response = paymentService.initializePayment("booking-001");

            assertNotNull(response);
            assertEquals("booking-001", response.getBookingId());
            assertEquals(2000000.0, response.getAmount(), 0.01);
            assertNotNull(response.getQrCodeUrl(), "QR URL phải được sinh ra");
            assertNotNull(response.getPaymentReference(), "Payment reference phải được sinh ra");
            assertTrue(response.getQrCodeUrl().contains("vietqr.io"), "QR URL phải là VietQR");

            verify(transactionRepository, times(1)).save(any());
        }
    }

    @Test
    @DisplayName("TC02 - Booking không tồn tại - Exception: BOOKING_NOT_FOUND")
    void testInitializePayment_BookingNotFound_ThrowsException() {
        when(bookingRepository.findById("nonexistent")).thenReturn(Optional.empty());

        BusinessException ex = assertThrows(BusinessException.class,
                () -> paymentService.initializePayment("nonexistent"));

        assertEquals("BOOKING_NOT_FOUND", ex.getCode());
        verify(transactionRepository, never()).save(any());
    }

    @Test
    @DisplayName("TC03 - Booking đã được thanh toán (CONFIRMED) - Branch: INVALID_BOOKING_STATUS")
    void testInitializePayment_BookingConfirmed_ThrowsException() {
        mockBooking.setStatus(Booking.BookingStatus.CONFIRMED);
        when(bookingRepository.findById("booking-001")).thenReturn(Optional.of(mockBooking));

        BusinessException ex = assertThrows(BusinessException.class,
                () -> paymentService.initializePayment("booking-001"));

        assertEquals("INVALID_BOOKING_STATUS", ex.getCode());
    }

    @Test
    @DisplayName("TC04 - Booking đã bị hủy (CANCELLED) - Branch: INVALID_BOOKING_STATUS")
    void testInitializePayment_BookingCancelled_ThrowsException() {
        mockBooking.setStatus(Booking.BookingStatus.CANCELLED);
        when(bookingRepository.findById("booking-001")).thenReturn(Optional.of(mockBooking));

        BusinessException ex = assertThrows(BusinessException.class,
                () -> paymentService.initializePayment("booking-001"));

        assertEquals("INVALID_BOOKING_STATUS", ex.getCode());
    }

    @Test
    @DisplayName("TC05 - Thanh toán cho booking của người khác - Branch: ACCESS_DENIED")
    void testInitializePayment_NotOwner_ThrowsAccessDenied() {
        mockBooking.setUserId("other-user-999");
        try (MockedStatic<SecurityUtil> mocked = mockStatic(SecurityUtil.class)) {
            mocked.when(SecurityUtil::getCurrentUserEmail).thenReturn("user@travel.com");
            when(bookingRepository.findById("booking-001")).thenReturn(Optional.of(mockBooking));
            when(userRepository.findByEmail("user@travel.com")).thenReturn(Optional.of(mockUser));

            BusinessException ex = assertThrows(BusinessException.class,
                    () -> paymentService.initializePayment("booking-001"));

            assertEquals("ACCESS_DENIED", ex.getCode());
        }
    }

    @Test
    @DisplayName("TC06 - ADMIN có thể thanh toán bất kỳ booking - Branch: Admin bypass")
    void testInitializePayment_Admin_CanPayAnyBooking() {
        mockBooking.setUserId("other-user-999");
        User adminUser = User.builder()
                .id("admin-001").email("admin@travel.com").role(Role.ADMIN).build();

        try (MockedStatic<SecurityUtil> mocked = mockStatic(SecurityUtil.class)) {
            mocked.when(SecurityUtil::getCurrentUserEmail).thenReturn("admin@travel.com");
            when(bookingRepository.findById("booking-001")).thenReturn(Optional.of(mockBooking));
            when(userRepository.findByEmail("admin@travel.com")).thenReturn(Optional.of(adminUser));
            when(transactionRepository.save(any())).thenReturn(mockTransaction);
            when(bookingRepository.save(any())).thenReturn(mockBooking);

            PaymentInitResponse response = paymentService.initializePayment("booking-001");

            assertNotNull(response, "Admin phải được phép thanh toán bất kỳ booking nào");
        }
    }

    // =========================================================
    // PROCESS PAYMENT SUCCESS TESTS
    // =========================================================

    @Test
    @DisplayName("TC07 - Xử lý thanh toán thành công - Path Testing")
    void testProcessPaymentSuccess_Success() {
        when(transactionRepository.findByTransactionReference("TRV123456"))
                .thenReturn(Optional.of(mockTransaction));
        when(bookingRepository.findById("booking-001")).thenReturn(Optional.of(mockBooking));
        when(transactionRepository.save(any())).thenReturn(mockTransaction);
        when(bookingRepository.save(any())).thenReturn(mockBooking);

        assertDoesNotThrow(() -> paymentService.processPaymentSuccess("TRV123456"));

        assertEquals(Transaction.TransactionStatus.SUCCESS, mockTransaction.getStatus(),
                "Transaction status phải chuyển sang SUCCESS");
        assertEquals(Booking.BookingStatus.CONFIRMED, mockBooking.getStatus(),
                "Booking status phải chuyển sang CONFIRMED");

        verify(transactionRepository, times(1)).save(any());
        verify(bookingRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("TC08 - Xử lý thanh toán đã SUCCESS (idempotent) - Branch Coverage")
    void testProcessPaymentSuccess_AlreadySuccess_IsIdempotent() {
        // Branch: transaction đã SUCCESS -> return ngay, không xử lý lại
        mockTransaction.setStatus(Transaction.TransactionStatus.SUCCESS);
        when(transactionRepository.findByTransactionReference("TRV123456"))
                .thenReturn(Optional.of(mockTransaction));

        assertDoesNotThrow(() -> paymentService.processPaymentSuccess("TRV123456"));

        // Verify: không gọi save khi đã SUCCESS (idempotent behavior)
        verify(transactionRepository, never()).save(any());
        verify(bookingRepository, never()).save(any());
    }

    @Test
    @DisplayName("TC09 - Transaction không tồn tại - Exception: TRANSACTION_NOT_FOUND")
    void testProcessPaymentSuccess_TransactionNotFound_ThrowsException() {
        when(transactionRepository.findByTransactionReference("INVALID_REF"))
                .thenReturn(Optional.empty());

        BusinessException ex = assertThrows(BusinessException.class,
                () -> paymentService.processPaymentSuccess("INVALID_REF"));

        assertEquals("TRANSACTION_NOT_FOUND", ex.getCode());
    }
}

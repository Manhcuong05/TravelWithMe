package com.example.travel.payment.service;

import com.example.travel.booking.entity.Booking;
import com.example.travel.booking.repository.BookingRepository;
import com.example.travel.core.exception.BusinessException;
import com.example.travel.payment.dto.PaymentInitResponse;
import com.example.travel.payment.entity.Transaction;
import com.example.travel.payment.repository.TransactionRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private PaymentService paymentService;

    private Booking booking;

    @BeforeEach
    void setUp() {
        booking = new Booking();
        booking.setId("B001");
        booking.setTotalAmount(1000000);
        booking.setStatus(Booking.BookingStatus.PENDING);
    }

    // ===== initializePayment =====

    //Kiểm tra hệ thống xử lý khi bookingId không tồn tại trong database.
    @Test
    void initializePayment_BookingNotFound_ShouldThrowException() {

        when(bookingRepository.findById("B001")).thenReturn(Optional.empty());

        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> paymentService.initializePayment("B001")
        );

        assertEquals("BOOKING_NOT_FOUND", ex.getCode());
    }

    //Kiểm tra khi booking có trạng thái không hợp lệ để thanh toán.
    @Test
    void initializePayment_InvalidStatus_ShouldThrowException() {

        booking.setStatus(Booking.BookingStatus.CANCELLED);

        when(bookingRepository.findById("B001")).thenReturn(Optional.of(booking));

        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> paymentService.initializePayment("B001")
        );

        assertEquals("INVALID_BOOKING_STATUS", ex.getCode());
    }

    //Kiểm tra khởi tạo thanh toán thành công.
    @Test
    void initializePayment_ValidBooking_ShouldCreateTransaction() {

        when(bookingRepository.findById("B001")).thenReturn(Optional.of(booking));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(i -> i.getArgument(0));

        PaymentInitResponse response = paymentService.initializePayment("B001");

        assertNotNull(response);
        assertEquals("B001", response.getBookingId());
        assertEquals(1000000, response.getAmount());

        verify(transactionRepository).save(any(Transaction.class));
        verify(bookingRepository).save(booking);
    }

    // ===== processPaymentSuccess =====

    //Kiểm tra khi transaction reference không tồn tại.
    @Test
    void processPaymentSuccess_TransactionNotFound_ShouldThrowException() {

        when(transactionRepository.findByTransactionReference("REF123"))
                .thenReturn(Optional.empty());

        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> paymentService.processPaymentSuccess("REF123")
        );

        assertEquals("TRANSACTION_NOT_FOUND", ex.getCode());
    }

    //Kiểm tra khi transaction đã được xử lý thành công trước đó.
    @Test
    void processPaymentSuccess_TransactionAlreadySuccess_ShouldReturn() {

        Transaction transaction = new Transaction();
        transaction.setBookingId("B001");
        transaction.setStatus(Transaction.TransactionStatus.SUCCESS);

        when(transactionRepository.findByTransactionReference("REF123"))
                .thenReturn(Optional.of(transaction));

        paymentService.processPaymentSuccess("REF123");

        verify(transactionRepository, never()).save(any());
        verify(bookingRepository, never()).save(any());
    }

    //Kiểm tra xử lý thanh toán thành công.
    @Test
    void processPaymentSuccess_ValidTransaction_ShouldUpdateBooking() {

        Transaction transaction = new Transaction();
        transaction.setBookingId("B001");
        transaction.setStatus(Transaction.TransactionStatus.PENDING);

        when(transactionRepository.findByTransactionReference("REF123"))
                .thenReturn(Optional.of(transaction));

        when(bookingRepository.findById("B001"))
                .thenReturn(Optional.of(booking));

        paymentService.processPaymentSuccess("REF123");

        assertEquals(Transaction.TransactionStatus.SUCCESS, transaction.getStatus());
        assertEquals(Booking.BookingStatus.CONFIRMED, booking.getStatus());

        verify(transactionRepository).save(transaction);
        verify(bookingRepository).save(booking);
    }
}
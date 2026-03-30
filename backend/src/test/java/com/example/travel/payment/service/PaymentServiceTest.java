package com.example.travel.payment.service;

import com.example.travel.booking.entity.Booking;
import com.example.travel.booking.repository.BookingRepository;
import com.example.travel.core.constant.Role;
import com.example.travel.core.exception.BusinessException;
import com.example.travel.core.service.EmailService;
import com.example.travel.core.util.SecurityUtil;
import com.example.travel.identity.entity.User;
import com.example.travel.identity.repository.UserRepository;
import com.example.travel.payment.dto.PaymentInitResponse;
import com.example.travel.payment.entity.Transaction;
import com.example.travel.payment.repository.TransactionRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private PaymentService paymentService;

    private MockedStatic<SecurityUtil> mockedSecurityUtil;

    private User mockUser;
    private Booking mockBooking;
    private Transaction mockTransaction;

    @BeforeEach
    void setUp() {
        mockedSecurityUtil = mockStatic(SecurityUtil.class);
        
        mockUser = User.builder()
                .id("user123")
                .email("test@travel.com")
                .role(Role.TRAVELER)
                .build();

        mockBooking = Booking.builder()
                .id("booking123")
                .userId("user123")
                .totalAmount(5000000)
                .status(Booking.BookingStatus.PENDING)
                .build();

        mockTransaction = Transaction.builder()
                .id("tx123")
                .bookingId("booking123")
                .transactionReference("TRV123456")
                .status(Transaction.TransactionStatus.PENDING)
                .amount(5000000)
                .build();
    }

    @AfterEach
    void tearDown() {
        mockedSecurityUtil.close();
    }

    @Test
    void initializePayment_Success() {
        // Arrange
        when(bookingRepository.findById("booking123")).thenReturn(Optional.of(mockBooking));
        mockedSecurityUtil.when(SecurityUtil::getCurrentUserEmail).thenReturn("test@travel.com");
        when(userRepository.findByEmail("test@travel.com")).thenReturn(Optional.of(mockUser));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(i -> i.getArguments()[0]);
        when(bookingRepository.save(any(Booking.class))).thenReturn(mockBooking);

        // Act
        PaymentInitResponse response = paymentService.initializePayment("booking123");

        // Assert
        assertNotNull(response);
        assertEquals("booking123", response.getBookingId());
        assertNotNull(response.getPaymentReference());
        assertNotNull(response.getQrCodeUrl());
        assertEquals(Booking.BookingStatus.AWAITING_PAYMENT, mockBooking.getStatus());
        
        verify(transactionRepository, times(1)).save(any(Transaction.class));
        verify(bookingRepository, times(1)).save(mockBooking);
    }

    @Test
    void initializePayment_BookingNotFound_ThrowsException() {
        // Arrange
        when(bookingRepository.findById("invalid")).thenReturn(Optional.empty());

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> 
            paymentService.initializePayment("invalid"));
        
        assertEquals("BOOKING_NOT_FOUND", exception.getCode());
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void initializePayment_InvalidStatus_ThrowsException() {
        // Arrange
        mockBooking.setStatus(Booking.BookingStatus.PAID);
        when(bookingRepository.findById("booking123")).thenReturn(Optional.of(mockBooking));

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> 
            paymentService.initializePayment("booking123"));
        
        assertEquals("INVALID_BOOKING_STATUS", exception.getCode());
    }

    @Test
    void processPaymentSuccess_Success() {
        // Arrange
        when(transactionRepository.findByTransactionReference("TRV123456")).thenReturn(Optional.of(mockTransaction));
        when(bookingRepository.findById("booking123")).thenReturn(Optional.of(mockBooking));
        when(userRepository.findById("user123")).thenReturn(Optional.of(mockUser));

        // Act
        paymentService.processPaymentSuccess("TRV123456");

        // Assert
        assertEquals(Transaction.TransactionStatus.SUCCESS, mockTransaction.getStatus());
        assertEquals(Booking.BookingStatus.CONFIRMED, mockBooking.getStatus());
        
        verify(transactionRepository, times(1)).save(mockTransaction);
        verify(bookingRepository, times(1)).save(mockBooking);
        verify(emailService, times(1)).sendBookingConfirmation(mockBooking, mockUser);
    }

    @Test
    void processPaymentSuccess_TransactionAlreadySuccess_DoesNothing() {
        // Arrange
        mockTransaction.setStatus(Transaction.TransactionStatus.SUCCESS);
        when(transactionRepository.findByTransactionReference("TRV123456")).thenReturn(Optional.of(mockTransaction));

        // Act
        paymentService.processPaymentSuccess("TRV123456");

        // Assert
        verify(transactionRepository, never()).save(any());
        verify(bookingRepository, never()).save(any());
        verify(emailService, never()).sendBookingConfirmation(any(), any());
    }
}

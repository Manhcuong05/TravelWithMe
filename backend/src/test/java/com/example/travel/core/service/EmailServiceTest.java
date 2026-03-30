package com.example.travel.core.service;

import com.example.travel.booking.entity.Booking;
import com.example.travel.booking.entity.BookingContact;
import com.example.travel.booking.entity.BookingItem;
import com.example.travel.catalog.dto.ServiceType;
import com.example.travel.catalog.repository.FlightRepository;
import com.example.travel.catalog.repository.HotelRoomRepository;
import com.example.travel.catalog.repository.TourRepository;
import com.example.travel.identity.entity.OtpToken;
import com.example.travel.identity.entity.User;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private TourRepository tourRepository;

    @Mock
    private FlightRepository flightRepository;

    @Mock
    private HotelRoomRepository hotelRoomRepository;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(emailService, "fromEmail", "noreply@travel.com");
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
    }

    @Test
    void sendBookingConfirmation_WithContact_SendsSuccessfully() {
        // Arrange
        BookingContact contact = BookingContact.builder()
                .email("contact@test.com")
                .fullName("Test Contact")
                .build();

        BookingItem item = BookingItem.builder()
                .serviceId("tour123")
                .serviceType(ServiceType.TOUR)
                .priceAtBooking(500000)
                .quantity(2)
                .build();

        Booking booking = Booking.builder()
                .id("booking123")
                .contact(contact)
                .items(List.of(item))
                .totalAmount(1000000)
                .build();

        User user = User.builder().email("user@test.com").fullName("Test User").build();

        // Act
        emailService.sendBookingConfirmation(booking, user);

        // Assert
        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void sendBookingConfirmation_NoContact_UsesUserEmail() {
        // Arrange
        Booking booking = Booking.builder()
                .id("booking123")
                .items(List.of())
                .totalAmount(0)
                .build();

        User user = User.builder().email("user@test.com").fullName("Test User").build();

        // Act
        emailService.sendBookingConfirmation(booking, user);

        // Assert
        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void sendOtpEmail_LoginType_SendsSuccessfully() {
        // Act
        emailService.sendOtpEmail("user@test.com", "123456", OtpToken.OtpType.LOGIN);

        // Assert
        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void sendOtpEmail_PasswordRecoveryType_SendsSuccessfully() {
        // Act
        emailService.sendOtpEmail("user@test.com", "123456", OtpToken.OtpType.RESET_PASSWORD);

        // Assert
        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void sendReviewReminderEmail_SendsSuccessfully() {
        // Act
        emailService.sendReviewReminderEmail("user@test.com", "Test User", "Sapa Tour", "tour123");

        // Assert
        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void sendEmailException_CatchesSilently() {
        // Arrange
        doThrow(new RuntimeException("SMTP Server down")).when(mailSender).send(any(MimeMessage.class));

        // Act & Assert
        // Should not throw exception upwards since it catches internally
        emailService.sendOtpEmail("user@test.com", "123456", OtpToken.OtpType.LOGIN);
        
        verify(mailSender, times(1)).send(mimeMessage);
    }
}

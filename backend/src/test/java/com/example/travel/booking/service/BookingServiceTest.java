package com.example.travel.booking.service;

import com.example.travel.booking.dto.BookingRequest;
import com.example.travel.booking.dto.BookingResponse;
import com.example.travel.booking.entity.Booking;
import com.example.travel.booking.repository.BookingItemRepository;
import com.example.travel.booking.repository.BookingRepository;
import com.example.travel.catalog.dto.ServiceType;
import com.example.travel.catalog.entity.Flight;
import com.example.travel.catalog.entity.HotelRoom;
import com.example.travel.catalog.entity.Tour;
import com.example.travel.catalog.repository.FlightRepository;
import com.example.travel.catalog.repository.HotelRoomRepository;
import com.example.travel.catalog.repository.TourRepository;
import com.example.travel.core.constant.Role;
import com.example.travel.core.exception.BusinessException;
import com.example.travel.core.util.SecurityUtil;
import com.example.travel.identity.entity.User;
import com.example.travel.identity.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * KIỂM THỬ HỘP TRẮNG - BookingService
 *
 * Kỹ thuật áp dụng:
 * - Branch Coverage: Kiểm tra switch(serviceType): HOTEL, FLIGHT, TOUR, POI
 * - Path Testing: Kiểm tra tất cả luồng trong createBooking()
 * - Exception Testing: INVALID_DATES, OUT_OF_STOCK, NOT_BOOKABLE,
 * ACCESS_DENIED, INVALID_STATUS
 * - State Transition: cancelBooking() theo các trạng thái: AWAITING_PAYMENT,
 * CONFIRMED, COMPLETED
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("BookingService - Kiểm thử hộp trắng")
public class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;
    @Mock
    private BookingItemRepository bookingItemRepository;
    @Mock
    private HotelRoomRepository hotelRoomRepository;
    @Mock
    private FlightRepository flightRepository;
    @Mock
    private TourRepository tourRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BookingService bookingService;

    private User mockUser;
    private HotelRoom mockRoom;
    private Flight mockFlight;
    private Tour mockTour;
    private Booking mockBooking;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id("user-001").email("user@travel.com").role(Role.TRAVELER)
                .build();

        mockRoom = HotelRoom.builder()
                .id("room-001").roomType("Deluxe").pricePerNight(500000.0).totalRooms(10)
                .build();

        mockFlight = Flight.builder()
                .id("flight-001").basePrice(1500000.0)
                .build();

        mockTour = Tour.builder()
                .id("tour-001").title("Hạ Long Bay").price(3000000.0)
                .build();

        mockBooking = Booking.builder()
                .id("booking-001")
                .userId("user-001")
                .status(Booking.BookingStatus.AWAITING_PAYMENT)
                .totalAmount(1000000.0)
                .items(new ArrayList<>())
                .build();
    }

    // =========================================================
    // CREATE BOOKING - HOTEL
    // =========================================================

    @Test
    @DisplayName("TC01 - Đặt phòng khách sạn thành công với ngày hợp lệ - Branch: HOTEL")
    void testCreateBooking_Hotel_Success() {
        try (MockedStatic<SecurityUtil> mocked = mockStatic(SecurityUtil.class)) {
            mocked.when(SecurityUtil::getCurrentUserEmail).thenReturn("user@travel.com");
            when(userRepository.findByEmail("user@travel.com")).thenReturn(Optional.of(mockUser));
            when(hotelRoomRepository.findById("room-001")).thenReturn(Optional.of(mockRoom));
            when(bookingItemRepository.countBookedQuantityInRange(
                    eq("room-001"), eq(ServiceType.HOTEL), any(), any())).thenReturn(0);
            when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> {
                Booking b = i.getArgument(0);
                b.setId("booking-001");
                return b;
            });

            BookingRequest request = buildHotelRequest("room-001", 1,
                    LocalDate.of(2025, 6, 1), LocalDate.of(2025, 6, 3));

            BookingResponse response = bookingService.createBooking(request);

            assertNotNull(response);
            // 2 đêm * 500,000 = 1,000,000
            assertEquals(1000000.0, response.getTotalAmount(), 0.01);
            assertEquals(Booking.BookingStatus.AWAITING_PAYMENT, response.getStatus());
        }
    }

    @Test
    @DisplayName("TC02 - Đặt phòng với ngày trả phòng <= ngày nhận phòng - Branch: INVALID_DATES")
    void testCreateBooking_Hotel_InvalidDates_ThrowsException() {
        try (MockedStatic<SecurityUtil> mocked = mockStatic(SecurityUtil.class)) {
            mocked.when(SecurityUtil::getCurrentUserEmail).thenReturn("user@travel.com");
            when(userRepository.findByEmail("user@travel.com")).thenReturn(Optional.of(mockUser));
            when(hotelRoomRepository.findById("room-001")).thenReturn(Optional.of(mockRoom));

            BookingRequest request = buildHotelRequest("room-001", 1,
                    LocalDate.of(2025, 6, 5), LocalDate.of(2025, 6, 3)); // Ngày trả < nhận

            BusinessException ex = assertThrows(BusinessException.class,
                    () -> bookingService.createBooking(request));

            assertEquals("INVALID_DATES", ex.getCode());
        }
    }

    @Test
    @DisplayName("TC03 - Đặt phòng khi hết phòng trống - Branch: OUT_OF_STOCK")
    void testCreateBooking_Hotel_OutOfStock_ThrowsException() {
        try (MockedStatic<SecurityUtil> mocked = mockStatic(SecurityUtil.class)) {
            mocked.when(SecurityUtil::getCurrentUserEmail).thenReturn("user@travel.com");
            when(userRepository.findByEmail("user@travel.com")).thenReturn(Optional.of(mockUser));
            when(hotelRoomRepository.findById("room-001")).thenReturn(Optional.of(mockRoom));
            // 10 phòng đã được đặt hết
            when(bookingItemRepository.countBookedQuantityInRange(
                    any(), any(), any(), any())).thenReturn(10);

            BookingRequest request = buildHotelRequest("room-001", 1,
                    LocalDate.of(2025, 6, 1), LocalDate.of(2025, 6, 3));

            BusinessException ex = assertThrows(BusinessException.class,
                    () -> bookingService.createBooking(request));

            assertEquals("OUT_OF_STOCK", ex.getCode());
        }
    }

    @Test
    @DisplayName("TC04 - Đặt vé máy bay thành công - Branch: FLIGHT")
    void testCreateBooking_Flight_Success() {
        try (MockedStatic<SecurityUtil> mocked = mockStatic(SecurityUtil.class)) {
            mocked.when(SecurityUtil::getCurrentUserEmail).thenReturn("user@travel.com");
            when(userRepository.findByEmail("user@travel.com")).thenReturn(Optional.of(mockUser));
            when(flightRepository.findById("flight-001")).thenReturn(Optional.of(mockFlight));
            when(bookingRepository.save(any())).thenAnswer(i -> {
                Booking b = i.getArgument(0);
                b.setId("booking-002");
                return b;
            });

            BookingRequest request = buildFlightRequest("flight-001", 2);

            BookingResponse response = bookingService.createBooking(request);

            assertNotNull(response);
            // 2 vé * 1,500,000 = 3,000,000
            assertEquals(3000000.0, response.getTotalAmount(), 0.01);
        }
    }

    @Test
    @DisplayName("TC05 - Đặt Tour thành công - Branch: TOUR")
    void testCreateBooking_Tour_Success() {
        try (MockedStatic<SecurityUtil> mocked = mockStatic(SecurityUtil.class)) {
            mocked.when(SecurityUtil::getCurrentUserEmail).thenReturn("user@travel.com");
            when(userRepository.findByEmail("user@travel.com")).thenReturn(Optional.of(mockUser));
            when(tourRepository.findById("tour-001")).thenReturn(Optional.of(mockTour));
            when(bookingRepository.save(any())).thenAnswer(i -> {
                Booking b = i.getArgument(0);
                b.setId("booking-003");
                return b;
            });

            BookingRequest request = buildTourRequest("tour-001", 1);

            BookingResponse response = bookingService.createBooking(request);

            assertNotNull(response);
            assertEquals(3000000.0, response.getTotalAmount(), 0.01);
        }
    }

    @Test
    @DisplayName("TC06 - Đặt POI trực tiếp - Branch: NOT_BOOKABLE Exception")
    void testCreateBooking_POI_ThrowsNotBookable() {
        try (MockedStatic<SecurityUtil> mocked = mockStatic(SecurityUtil.class)) {
            mocked.when(SecurityUtil::getCurrentUserEmail).thenReturn("user@travel.com");
            when(userRepository.findByEmail("user@travel.com")).thenReturn(Optional.of(mockUser));

            BookingRequest.ItemRequest poiItem = BookingRequest.ItemRequest.builder()
                    .serviceId("poi-001").type(ServiceType.POI).quantity(1).build();
            BookingRequest request = new BookingRequest();
            request.setItems(List.of(poiItem));

            BusinessException ex = assertThrows(BusinessException.class,
                    () -> bookingService.createBooking(request));

            assertEquals("NOT_BOOKABLE", ex.getCode());
        }
    }

    // =========================================================
    // CANCEL BOOKING - State Transition Tests
    // =========================================================

    @Test
    @DisplayName("TC07 - Hủy đơn ở trạng thái AWAITING_PAYMENT - State Transition")
    void testCancelBooking_AwaitingPayment_Success() {
        try (MockedStatic<SecurityUtil> mocked = mockStatic(SecurityUtil.class)) {
            mocked.when(SecurityUtil::getCurrentUserEmail).thenReturn("user@travel.com");
            when(userRepository.findByEmail("user@travel.com")).thenReturn(Optional.of(mockUser));
            when(bookingRepository.findById("booking-001")).thenReturn(Optional.of(mockBooking));
            when(bookingRepository.save(any())).thenAnswer(i -> i.getArgument(0));

            BookingResponse response = bookingService.cancelBooking("booking-001");

            assertEquals(Booking.BookingStatus.CANCELLED, response.getStatus());
        }
    }

    @Test
    @DisplayName("TC08 - Hủy đơn ở trạng thái CONFIRMED - State Transition")
    void testCancelBooking_Confirmed_Success() {
        mockBooking.setStatus(Booking.BookingStatus.CONFIRMED);

        try (MockedStatic<SecurityUtil> mocked = mockStatic(SecurityUtil.class)) {
            mocked.when(SecurityUtil::getCurrentUserEmail).thenReturn("user@travel.com");
            when(userRepository.findByEmail("user@travel.com")).thenReturn(Optional.of(mockUser));
            when(bookingRepository.findById("booking-001")).thenReturn(Optional.of(mockBooking));
            when(bookingRepository.save(any())).thenAnswer(i -> i.getArgument(0));

            BookingResponse response = bookingService.cancelBooking("booking-001");

            assertEquals(Booking.BookingStatus.CANCELLED, response.getStatus());
        }
    }

    @Test
    @DisplayName("TC09 - Hủy đơn đã CANCELLED - Exception: INVALID_STATUS")
    void testCancelBooking_AlreadyCancelled_ThrowsException() {
        mockBooking.setStatus(Booking.BookingStatus.CANCELLED);

        try (MockedStatic<SecurityUtil> mocked = mockStatic(SecurityUtil.class)) {
            mocked.when(SecurityUtil::getCurrentUserEmail).thenReturn("user@travel.com");
            when(userRepository.findByEmail("user@travel.com")).thenReturn(Optional.of(mockUser));
            when(bookingRepository.findById("booking-001")).thenReturn(Optional.of(mockBooking));

            BusinessException ex = assertThrows(BusinessException.class,
                    () -> bookingService.cancelBooking("booking-001"));

            assertEquals("INVALID_STATUS", ex.getCode());
        }
    }

    @Test
    @DisplayName("TC10 - Hủy đơn của người khác - Exception: ACCESS_DENIED")
    void testCancelBooking_NotOwner_ThrowsAccessDenied() {
        // Booking thuộc user khác
        mockBooking.setUserId("other-user-999");

        try (MockedStatic<SecurityUtil> mocked = mockStatic(SecurityUtil.class)) {
            mocked.when(SecurityUtil::getCurrentUserEmail).thenReturn("user@travel.com");
            when(userRepository.findByEmail("user@travel.com")).thenReturn(Optional.of(mockUser));
            when(bookingRepository.findById("booking-001")).thenReturn(Optional.of(mockBooking));

            BusinessException ex = assertThrows(BusinessException.class,
                    () -> bookingService.cancelBooking("booking-001"));

            assertEquals("ACCESS_DENIED", ex.getCode());
        }
    }

    @Test
    @DisplayName("TC11 - Lấy booking của user - Statement Coverage")
    void testGetUserBookings_ReturnsList() {
        try (MockedStatic<SecurityUtil> mocked = mockStatic(SecurityUtil.class)) {
            mocked.when(SecurityUtil::getCurrentUserEmail).thenReturn("user@travel.com");
            when(userRepository.findByEmail("user@travel.com")).thenReturn(Optional.of(mockUser));
            when(bookingRepository.findByUserId("user-001")).thenReturn(List.of(mockBooking));

            List<BookingResponse> result = bookingService.getUserBookings();

            assertNotNull(result);
            assertEquals(1, result.size());
        }
    }

    @Test
    @DisplayName("TC12 - Xem booking không tồn tại - Exception: BOOKING_NOT_FOUND")
    void testGetBooking_NotFound_ThrowsException() {
        try (MockedStatic<SecurityUtil> mocked = mockStatic(SecurityUtil.class)) {
            mocked.when(SecurityUtil::getCurrentUserEmail).thenReturn("user@travel.com");
            when(userRepository.findByEmail("user@travel.com")).thenReturn(Optional.of(mockUser));
            when(bookingRepository.findById("nonexistent")).thenReturn(Optional.empty());

            BusinessException ex = assertThrows(BusinessException.class,
                    () -> bookingService.getBooking("nonexistent"));

            assertEquals("BOOKING_NOT_FOUND", ex.getCode());
        }
    }

    // =========================================================
    // HELPER METHODS
    // =========================================================

    private BookingRequest buildHotelRequest(String roomId, int qty, LocalDate in, LocalDate out) {
        BookingRequest.ItemRequest item = BookingRequest.ItemRequest.builder()
                .serviceId(roomId).type(ServiceType.HOTEL).quantity(qty)
                .checkInDate(in).checkOutDate(out).build();
        BookingRequest req = new BookingRequest();
        req.setItems(List.of(item));
        return req;
    }

    private BookingRequest buildFlightRequest(String flightId, int qty) {
        BookingRequest.ItemRequest item = BookingRequest.ItemRequest.builder()
                .serviceId(flightId).type(ServiceType.FLIGHT).quantity(qty).build();
        BookingRequest req = new BookingRequest();
        req.setItems(List.of(item));
        return req;
    }

    private BookingRequest buildTourRequest(String tourId, int qty) {
        BookingRequest.ItemRequest item = BookingRequest.ItemRequest.builder()
                .serviceId(tourId).type(ServiceType.TOUR).quantity(qty).build();
        BookingRequest req = new BookingRequest();
        req.setItems(List.of(item));
        return req;
    }
}

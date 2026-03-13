package com.example.travel.booking.service;

import com.example.travel.core.constant.Role;
import com.example.travel.booking.dto.BookingRequest;
import com.example.travel.booking.dto.BookingResponse;
import com.example.travel.booking.entity.Booking;
import com.example.travel.booking.entity.BookingItem;
import com.example.travel.booking.repository.BookingRepository;
import com.example.travel.catalog.dto.ServiceType;
import com.example.travel.catalog.entity.Flight;
import com.example.travel.catalog.entity.HotelRoom;
import com.example.travel.catalog.entity.Tour;
import com.example.travel.catalog.repository.FlightRepository;
import com.example.travel.catalog.repository.HotelRoomRepository;
import com.example.travel.catalog.repository.TourRepository;
import com.example.travel.core.exception.BusinessException;
import com.example.travel.core.util.SecurityUtil;
import com.example.travel.identity.entity.User;
import com.example.travel.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final HotelRoomRepository hotelRoomRepository;
    private final FlightRepository flightRepository;
    private final TourRepository tourRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        String userEmail = SecurityUtil.getCurrentUserEmail();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "Người dùng không tồn tại"));

        Booking booking = Booking.builder()
                .userId(user.getId())
                .status(Booking.BookingStatus.AWAITING_PAYMENT)
                .totalAmount(0)
                .items(new ArrayList<>())
                .build();

        double totalAmount = 0;
        List<BookingItem> items = new ArrayList<>();

        for (BookingRequest.ItemRequest itemReq : request.getItems()) {
            double price = 0;
            switch (itemReq.getType()) {
                case HOTEL:
                    HotelRoom room = hotelRoomRepository.findById(itemReq.getServiceId())
                            .orElseThrow(
                                    () -> new BusinessException("SERVICE_NOT_FOUND", "Không tìm thấy phòng khách sạn"));

                    if (room.getTotalRooms() < itemReq.getQuantity()) {
                        throw new BusinessException("OUT_OF_STOCK",
                                "Khách sạn không còn đủ phòng " + room.getRoomType());
                    }

                    price = room.getPricePerNight();
                    break;
                case FLIGHT:
                    Flight flight = flightRepository.findById(itemReq.getServiceId())
                            .orElseThrow(() -> new BusinessException("SERVICE_NOT_FOUND", "Không tìm thấy chuyến bay"));
                    price = flight.getBasePrice();
                    break;
                case TOUR:
                    Tour tour = tourRepository.findById(itemReq.getServiceId())
                            .orElseThrow(
                                    () -> new BusinessException("SERVICE_NOT_FOUND", "Không tìm thấy tour du lịch"));
                    price = tour.getPrice();
                    break;
                case POI:
                    throw new BusinessException("NOT_BOOKABLE", "Địa điểm tham quan không thể đặt chỗ trực tiếp");
            }

            BookingItem item = BookingItem.builder()
                    .booking(booking)
                    .serviceType(itemReq.getType())
                    .serviceId(itemReq.getServiceId())
                    .quantity(itemReq.getQuantity())
                    .priceAtBooking(price)
                    .build();

            items.add(item);
            totalAmount += price * itemReq.getQuantity();
        }

        booking.setItems(items);
        booking.setTotalAmount(totalAmount);

        Booking savedBooking = bookingRepository.save(booking);

        return mapToResponse(savedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings() {
        String userEmail = SecurityUtil.getCurrentUserEmail();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "Người dùng không tồn tại"));

        return bookingRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponse getBooking(String bookingId) {
        String userEmail = SecurityUtil.getCurrentUserEmail();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "Người dùng không tồn tại"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BusinessException("BOOKING_NOT_FOUND", "Không tìm thấy đơn hàng"));

        // Ownership check
        if (!booking.getUserId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new BusinessException("ACCESS_DENIED", "Bạn không có quyền xem đơn hàng này");
        }

        return mapToResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(String bookingId) {
        String userEmail = SecurityUtil.getCurrentUserEmail();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "Người dùng không tồn tại"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BusinessException("BOOKING_NOT_FOUND", "Không tìm thấy đơn hàng"));

        // Ownership check: Only owner or ADMIN can cancel
        if (!booking.getUserId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new BusinessException("ACCESS_DENIED", "Bạn không có quyền hủy đơn hàng này");
        }

        if (booking.getStatus() == Booking.BookingStatus.CONFIRMED) {
            // Logic for refund/penalty would go here
            booking.setStatus(Booking.BookingStatus.CANCELLED);
        } else if (booking.getStatus() == Booking.BookingStatus.PENDING
                || booking.getStatus() == Booking.BookingStatus.AWAITING_PAYMENT) {
            booking.setStatus(Booking.BookingStatus.CANCELLED);
        } else {
            throw new BusinessException("INVALID_STATUS", "Không thể hủy đơn hàng ở trạng thái hiện tại");
        }

        return mapToResponse(bookingRepository.save(booking));
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .items(booking.getItems().stream().map(item -> BookingResponse.ItemResponse.builder()
                        .serviceId(item.getServiceId())
                        .serviceType(item.getServiceType().name())
                        .quantity(item.getQuantity())
                        .price(item.getPriceAtBooking())
                        .build()).collect(Collectors.toList()))
                .build();
    }
}

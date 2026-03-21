package com.example.travel.booking.service;

import com.example.travel.core.constant.Role;
import com.example.travel.booking.dto.BookingRequest;
import com.example.travel.booking.dto.BookingResponse;
import com.example.travel.booking.entity.Booking;
import com.example.travel.booking.entity.BookingItem;
import com.example.travel.booking.repository.BookingItemRepository;
import com.example.travel.booking.repository.BookingRepository;
import com.example.travel.catalog.dto.ServiceType;
import com.example.travel.catalog.entity.Flight;
import com.example.travel.catalog.entity.FlightClass;
import com.example.travel.catalog.entity.HotelRoom;
import com.example.travel.catalog.entity.Tour;
import com.example.travel.catalog.repository.FlightRepository;
import com.example.travel.catalog.repository.HotelRoomRepository;
import com.example.travel.catalog.repository.TourRepository;
import com.example.travel.booking.entity.BookingContact;
import com.example.travel.booking.entity.BookingPassenger;
import java.time.LocalDate;
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
    private final BookingItemRepository bookingItemRepository;
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
                .passengers(new ArrayList<>())
                .build();

        if (request.getContact() != null) {
            BookingContact contact = BookingContact.builder()
                    .booking(booking)
                    .fullName(request.getContact().getName())
                    .phone(request.getContact().getPhone())
                    .email(request.getContact().getEmail())
                    .build();
            booking.setContact(contact);
        }

        if (request.getPassengers() != null) {
            List<BookingPassenger> passengers = request.getPassengers().stream()
                    .map(pReq -> BookingPassenger.builder()
                            .booking(booking)
                            .title(pReq.getTitle())
                            .firstName(pReq.getFirstName())
                            .lastName(pReq.getLastName())
                            .dob(pReq.getDob() != null && !pReq.getDob().isEmpty() ? LocalDate.parse(pReq.getDob())
                                    : LocalDate.now())
                            .nationality(pReq.getNationality())
                            .build())
                    .collect(Collectors.toList());
            booking.setPassengers(passengers);
        }

        double totalAmount = 0;
        List<BookingItem> items = new ArrayList<>();

        if (request.getAddons() != null) {
            if (request.getAddons().getBaggage() == 15)
                totalAmount += 250000;
            else if (request.getAddons().getBaggage() == 20)
                totalAmount += 320000;
            else if (request.getAddons().getBaggage() == 30)
                totalAmount += 450000;

            if (request.getAddons().isMeals())
                totalAmount += 120000;
            if (request.getAddons().isSeat())
                totalAmount += 42000;
            if (request.getAddons().isInsurance())
                totalAmount += 60500;
        }

        for (BookingRequest.ItemRequest itemReq : request.getItems()) {
            double price = 0;
            switch (itemReq.getType()) {
                case HOTEL:
                    HotelRoom room = hotelRoomRepository.findById(itemReq.getServiceId())
                            .orElseThrow(
                                    () -> new BusinessException("SERVICE_NOT_FOUND", "Không tìm thấy phòng khách sạn"));

                    long nights = 1;
                    // Kiểm tra phòng trống theo ngày
                    if (itemReq.getCheckInDate() != null && itemReq.getCheckOutDate() != null) {
                        nights = java.time.temporal.ChronoUnit.DAYS.between(itemReq.getCheckInDate(),
                                itemReq.getCheckOutDate());
                        if (nights <= 0) {
                            throw new BusinessException("INVALID_DATES", "Ngày trả phòng phải sau ngày nhận phòng");
                        }

                        int bookedQuantity = bookingItemRepository.countBookedQuantityInRange(
                                itemReq.getServiceId(),
                                ServiceType.HOTEL,
                                itemReq.getCheckInDate(),
                                itemReq.getCheckOutDate());

                        if (room.getTotalRooms() - bookedQuantity < itemReq.getQuantity()) {
                            throw new BusinessException("OUT_OF_STOCK",
                                    "Khách sạn hiện chỉ còn " + (room.getTotalRooms() - bookedQuantity)
                                            + " phòng trống loại " + room.getRoomType() + " cho khoảng thời gian này");
                        }
                    } else if (room.getTotalRooms() < itemReq.getQuantity()) {
                        // Fallback cho trường hợp không có ngày
                        throw new BusinessException("OUT_OF_STOCK",
                                "Khách sạn không còn đủ phòng " + room.getRoomType());
                    }

                    price = room.getPricePerNight() * nights;
                    break;
                case FLIGHT:
                    Flight flight = flightRepository.findById(itemReq.getServiceId())
                            .orElseThrow(() -> new BusinessException("SERVICE_NOT_FOUND", "Không tìm thấy chuyến bay"));

                    if (itemReq.getSubServiceId() == null) {
                        throw new BusinessException("CLASS_NOT_SELECTED", "Vui lòng chọn hạng vé");
                    }

                    FlightClass flightClass = flight.getFlightClasses().stream()
                            .filter(fc -> fc.getId().equals(itemReq.getSubServiceId()))
                            .findFirst()
                            .orElseThrow(
                                    () -> new BusinessException("CLASS_NOT_FOUND", "Không tìm thấy hạng vé hợp lệ"));

                    int passengers = itemReq.getAdults() + itemReq.getChildren();
                    if (flightClass.getAvailableSeats() < passengers) {
                        throw new BusinessException("OUT_OF_STOCK",
                                "Không còn đủ ghế cho hạng vé " + flightClass.getClassName());
                    }

                    // Deduct inventory
                    flightClass.setAvailableSeats(flightClass.getAvailableSeats() - passengers);

                    // Calculate precise total price for the flight
                    double flightTotal = (itemReq.getAdults() * flightClass.getPriceAdult()) +
                            (itemReq.getChildren() * flightClass.getPriceChild()) +
                            (itemReq.getInfants() * flightClass.getPriceInfant());

                    // Since the bottom logic does price * quantity, we normalize 'price' by
                    // quantity
                    // so the total comes out exact. Usually quantity = 1 for a flight segment.
                    price = flightTotal / Math.max(1, itemReq.getQuantity());
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
                    .subServiceId(itemReq.getSubServiceId())
                    .quantity(itemReq.getQuantity())
                    .adults(itemReq.getAdults())
                    .children(itemReq.getChildren())
                    .infants(itemReq.getInfants())
                    .priceAtBooking(price)
                    .checkInDate(itemReq.getCheckInDate())
                    .checkOutDate(itemReq.getCheckOutDate())
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
        BookingResponse response = BookingResponse.builder()
                .id(booking.getId())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .items(booking.getItems().stream().map(item -> {
                    BookingResponse.ItemResponse.ItemResponseBuilder itemRes = BookingResponse.ItemResponse.builder()
                            .serviceId(item.getServiceId())
                            .subServiceId(item.getSubServiceId())
                            .serviceType(item.getServiceType().name())
                            .quantity(item.getQuantity() != null ? item.getQuantity() : 1)
                            .price(item.getPriceAtBooking())
                            .adults(item.getAdults() != null ? item.getAdults() : 0)
                            .children(item.getChildren() != null ? item.getChildren() : 0)
                            .infants(item.getInfants() != null ? item.getInfants() : 0)
                            .checkInDate(item.getCheckInDate())
                            .checkOutDate(item.getCheckOutDate());

                    if (item.getServiceType() == ServiceType.FLIGHT) {
                        flightRepository.findById(item.getServiceId()).ifPresent(f -> {
                            itemRes.serviceName("Chuyến bay " + f.getDepartureCity() + " - " + f.getArrivalCity());
                            itemRes.airline(f.getAirline());
                            itemRes.departureCity(f.getDepartureCity());
                            itemRes.arrivalCity(f.getArrivalCity());
                            itemRes.departureTime(f.getDepartureTime());
                            itemRes.arrivalTime(f.getArrivalTime());

                            if (item.getSubServiceId() != null) {
                                f.getFlightClasses().stream()
                                        .filter(fc -> fc.getId().equals(item.getSubServiceId()))
                                        .findFirst()
                                        .ifPresent(fc -> itemRes.subServiceName(fc.getClassName()));
                            }
                        });
                    } else if (item.getServiceType() == ServiceType.HOTEL) {
                        hotelRoomRepository.findById(item.getServiceId()).ifPresent(r -> {
                            itemRes.serviceName(r.getRoomType());
                        });
                    } else if (item.getServiceType() == ServiceType.TOUR) {
                        tourRepository.findById(item.getServiceId()).ifPresent(t -> {
                            itemRes.serviceName(t.getTitle());
                        });
                    }

                    return itemRes.build();
                }).collect(Collectors.toList()))
                .build();

        if (booking.getContact() != null) {
            response.setContact(BookingResponse.ContactResponse.builder()
                    .name(booking.getContact().getFullName())
                    .phone(booking.getContact().getPhone())
                    .email(booking.getContact().getEmail())
                    .build());
        }

        if (booking.getPassengers() != null) {
            response.setPassengers(booking.getPassengers().stream().map(p -> BookingResponse.PassengerResponse.builder()
                    .title(p.getTitle())
                    .lastName(p.getLastName())
                    .firstName(p.getFirstName())
                    .dob(p.getDob() != null ? p.getDob().toString() : null)
                    .nationality(p.getNationality())
                    .build()).collect(Collectors.toList()));
        }

        return response;
    }
}

package com.example.travel.catalog.service;

import com.example.travel.catalog.dto.HotelRequest;
import com.example.travel.catalog.dto.HotelResponse;
import com.example.travel.catalog.dto.HotelRoomResponse;
import com.example.travel.catalog.entity.Hotel;
import com.example.travel.catalog.repository.HotelRepository;
import com.example.travel.catalog.repository.HotelRoomRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.example.travel.booking.repository.BookingItemRepository;
import com.example.travel.catalog.dto.ServiceType;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HotelService {

    private final HotelRepository hotelRepository;
    private final HotelRoomRepository hotelRoomRepository;
    private final BookingItemRepository bookingItemRepository;
    private final ObjectMapper objectMapper;

    public List<HotelResponse> searchHotels(String city) {
        List<Hotel> hotels;
        if (city != null && !city.isEmpty()) {
            hotels = hotelRepository.findByCity(city);
        } else {
            hotels = hotelRepository.findAll();
        }

        return hotels.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public HotelResponse getHotelById(String id, LocalDate checkIn, LocalDate checkOut) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách sạn"));
        return mapToResponse(hotel, checkIn, checkOut);
    }

    public HotelResponse saveHotel(HotelRequest request) {
        Hotel hotel = Hotel.builder()
                .name(request.getName())
                .description(request.getDescription())
                .address(request.getAddress())
                .city(request.getCity())
                .country(request.getCountry())
                .starRating(request.getStarRating())
                .imagesJson(toJson(request.getImages()))
                .build();
        return mapToResponse(hotelRepository.save(hotel));
    }

    public HotelResponse updateHotel(String id, HotelRequest request) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách sạn"));

        hotel.setName(request.getName());
        hotel.setDescription(request.getDescription());
        hotel.setAddress(request.getAddress());
        hotel.setCity(request.getCity());
        hotel.setCountry(request.getCountry());
        hotel.setStarRating(request.getStarRating());
        hotel.setImagesJson(toJson(request.getImages()));

        return mapToResponse(hotelRepository.save(hotel));
    }

    public void deleteHotel(String id) {
        if (!hotelRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy khách sạn để xóa");
        }
        hotelRepository.deleteById(id);
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            log.error("Error converting object to JSON", e);
            return "[]";
        }
    }

    private HotelResponse mapToResponse(Hotel hotel) {
        return mapToResponse(hotel, null, null);
    }

    private HotelResponse mapToResponse(Hotel hotel, LocalDate checkIn, LocalDate checkOut) {
        HotelResponse response = HotelResponse.builder()
                .id(hotel.getId())
                .name(hotel.getName())
                .description(hotel.getDescription())
                .address(hotel.getAddress())
                .city(hotel.getCity())
                .rating(hotel.getRating())
                .starRating(hotel.getStarRating())
                .images(fromJson(hotel.getImagesJson(), new TypeReference<List<String>>() {
                }))
                .build();

        // Load rooms
        response.setRooms(hotelRoomRepository.findByHotelId(hotel.getId()).stream()
                .map(room -> HotelRoomResponse.builder()
                        .id(room.getId())
                        .roomType(room.getRoomType())
                        .pricePerNight(room.getPricePerNight())
                        .capacity(room.getCapacity())
                        .totalRooms(room.getTotalRooms())
                        .availableRooms(calculateAvailability(room.getId(), room.getTotalRooms(), checkIn, checkOut))
                        .classification(room.getClassification())
                        .amenities(fromJson(room.getAmenitiesJson(), new TypeReference<List<String>>() {
                        }))
                        .build())
                .sorted((r1, r2) -> Double.compare(r1.getPricePerNight(), r2.getPricePerNight()))
                .collect(Collectors.toList()));

        return response;
    }

    private int calculateAvailability(String roomId, int totalRooms, LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null) {
            // If no dates, show capacity minus current (today) bookings to give a "live" feel
            // or just return totalRooms if you prefer a static base.
            // Let's count for today as a default.
            LocalDate today = LocalDate.now();
            int booked = bookingItemRepository.countBookedQuantityInRange(roomId, ServiceType.HOTEL, today, today.plusDays(1));
            return Math.max(0, totalRooms - booked);
        }
        int booked = bookingItemRepository.countBookedQuantityInRange(roomId, ServiceType.HOTEL, checkIn, checkOut);
        return Math.max(0, totalRooms - booked);
    }

    private <T> T fromJson(String json, TypeReference<T> typeReference) {
        if (json == null || json.isEmpty()) {
            return null; // or empty collection depending on type
        }
        try {
            return objectMapper.readValue(json, typeReference);
        } catch (JsonProcessingException e) {
            log.error("Error parsing JSON", e);
            return null;
        }
    }
}

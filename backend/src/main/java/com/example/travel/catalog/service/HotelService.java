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

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HotelService {

    private final HotelRepository hotelRepository;
    private final HotelRoomRepository hotelRoomRepository;
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

    public HotelResponse getHotelById(String id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách sạn"));
        return mapToResponse(hotel);
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
                        .amenities(fromJson(room.getAmenitiesJson(), new TypeReference<List<String>>() {
                        }))
                        .build())
                .collect(Collectors.toList()));

        return response;
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

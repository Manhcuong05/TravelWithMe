package com.example.travel.catalog.service;

import com.example.travel.catalog.dto.HotelRoomRequest;
import com.example.travel.catalog.dto.HotelRoomResponse;
import com.example.travel.catalog.entity.Hotel;
import com.example.travel.catalog.entity.HotelRoom;
import com.example.travel.catalog.repository.HotelRepository;
import com.example.travel.catalog.repository.HotelRoomRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class HotelRoomService {

    private final HotelRoomRepository hotelRoomRepository;
    private final HotelRepository hotelRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public HotelRoomResponse addRoom(String hotelId, HotelRoomRequest request) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách sạn"));

        HotelRoom room = HotelRoom.builder()
                .hotel(hotel)
                .roomType(request.getRoomType())
                .pricePerNight(request.getPricePerNight())
                .capacity(request.getCapacity())
                .totalRooms(request.getTotalRooms())
                .classification(request.getClassification())
                .amenitiesJson(toJson(request.getAmenities()))
                .build();

        return mapToResponse(hotelRoomRepository.save(room));
    }

    @Transactional
    public HotelRoomResponse updateRoom(String roomId, HotelRoomRequest request) {
        HotelRoom room = hotelRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng khách sạn"));

        room.setRoomType(request.getRoomType());
        room.setPricePerNight(request.getPricePerNight());
        room.setCapacity(request.getCapacity());
        room.setTotalRooms(request.getTotalRooms());
        room.setClassification(request.getClassification());
        room.setAmenitiesJson(toJson(request.getAmenities()));

        return mapToResponse(hotelRoomRepository.save(room));
    }

    @Transactional
    public void deleteRoom(String roomId) {
        if (!hotelRoomRepository.existsById(roomId)) {
            throw new RuntimeException("Không tìm thấy phòng khách sạn để xóa");
        }
        hotelRoomRepository.deleteById(roomId);
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            log.error("Error converting object to JSON", e);
            return "[]";
        }
    }

    private <T> T fromJson(String json, TypeReference<T> typeReference) {
        if (json == null || json.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(json, typeReference);
        } catch (JsonProcessingException e) {
            log.error("Error parsing JSON", e);
            return null;
        }
    }

    private HotelRoomResponse mapToResponse(HotelRoom room) {
        return HotelRoomResponse.builder()
                .id(room.getId())
                .roomType(room.getRoomType())
                .pricePerNight(room.getPricePerNight())
                .capacity(room.getCapacity())
                .totalRooms(room.getTotalRooms())
                .classification(room.getClassification())
                .amenities(fromJson(room.getAmenitiesJson(), new TypeReference<List<String>>() {
                }))
                .build();
    }
}

package com.example.travel.catalog.service;

import com.example.travel.catalog.dto.HotelResponse;
import com.example.travel.catalog.entity.Hotel;
import com.example.travel.catalog.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;

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
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
        return mapToResponse(hotel);
    }

    private HotelResponse mapToResponse(Hotel hotel) {
        return HotelResponse.builder()
                .id(hotel.getId())
                .name(hotel.getName())
                .description(hotel.getDescription())
                .address(hotel.getAddress())
                .city(hotel.getCity())
                .rating(hotel.getRating())
                .starRating(hotel.getStarRating())
                .build();
    }
}

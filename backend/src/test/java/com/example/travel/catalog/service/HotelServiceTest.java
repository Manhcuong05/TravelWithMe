package com.example.travel.catalog.service;

import com.example.travel.catalog.dto.HotelResponse;
import com.example.travel.catalog.entity.Hotel;
import com.example.travel.catalog.repository.HotelRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HotelServiceTest {

    @Mock
    private HotelRepository hotelRepository;

    @InjectMocks
    private HotelService hotelService;

    private Hotel hotel;

    @BeforeEach
    void setUp() {

        // Khởi tạo dữ liệu hotel mẫu
        hotel = new Hotel();
        hotel.setId("H001");
        hotel.setName("Sunrise Hotel");
        hotel.setDescription("Luxury hotel");
        hotel.setAddress("123 Street");
        hotel.setCity("Hanoi");
        hotel.setRating(4.5);
        hotel.setStarRating(5);
    }

    // ===== TEST: SEARCH HOTEL BY CITY =====

    @Test
    void searchHotels_WithCity_ShouldReturnFilteredHotels() {

        // Trường hợp: người dùng tìm khách sạn theo thành phố
        when(hotelRepository.findByCity("Hanoi"))
                .thenReturn(List.of(hotel));

        List<HotelResponse> result = hotelService.searchHotels("Hanoi");

        assertEquals(1, result.size());
        assertEquals("Sunrise Hotel", result.get(0).getName());

        verify(hotelRepository).findByCity("Hanoi");
    }

    // ===== TEST: SEARCH ALL HOTELS =====

    @Test
    void searchHotels_WithoutCity_ShouldReturnAllHotels() {

        // Trường hợp: không nhập city → trả về tất cả hotel
        when(hotelRepository.findAll())
                .thenReturn(List.of(hotel));

        List<HotelResponse> result = hotelService.searchHotels(null);

        assertEquals(1, result.size());
        assertEquals("Sunrise Hotel", result.get(0).getName());

        verify(hotelRepository).findAll();
    }

    // ===== TEST: SEARCH RETURN EMPTY =====

    @Test
    void searchHotels_NoHotelsFound_ShouldReturnEmptyList() {

        // Trường hợp: không tìm thấy khách sạn trong city
        when(hotelRepository.findByCity("Danang"))
                .thenReturn(List.of());

        List<HotelResponse> result = hotelService.searchHotels("Danang");

        assertTrue(result.isEmpty());
    }

    // ===== TEST: GET HOTEL BY ID SUCCESS =====

    @Test
    void getHotelById_ExistingHotel_ShouldReturnHotel() {

        // Trường hợp: hotel tồn tại
        when(hotelRepository.findById("H001"))
                .thenReturn(Optional.of(hotel));

        HotelResponse response = hotelService.getHotelById("H001");

        assertNotNull(response);
        assertEquals("Sunrise Hotel", response.getName());
        assertEquals("Hanoi", response.getCity());
    }

    // ===== TEST: HOTEL NOT FOUND =====

    @Test
    void getHotelById_HotelNotFound_ShouldThrowException() {

        // Trường hợp: hotel không tồn tại
        when(hotelRepository.findById("H001"))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> hotelService.getHotelById("H001")
        );

        assertEquals("Hotel not found", ex.getMessage());
    }
}
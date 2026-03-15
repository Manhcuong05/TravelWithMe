package com.example.travel.catalog.service;

import com.example.travel.catalog.dto.FlightResponse;
import com.example.travel.catalog.entity.Flight;
import com.example.travel.catalog.repository.FlightRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FlightServiceTest {

    @Mock
    private FlightRepository flightRepository;

    @InjectMocks
    private FlightService flightService;

    private Flight flight;

    @BeforeEach
    void setUp() {

        // Khởi tạo dữ liệu chuyến bay mẫu
        flight = new Flight();
        flight.setId("F001");
        flight.setFlightNumber("VN123");
        flight.setAirline("Vietnam Airlines");
        flight.setDepartureCity("Hanoi");
        flight.setArrivalCity("HoChiMinh");
        flight.setDepartureTime(LocalDateTime.now());
        flight.setArrivalTime(LocalDateTime.now().plusHours(2));
        flight.setBasePrice(1500000);
    }

    // ===== TEST: SEARCH WITH DEPARTURE AND ARRIVAL =====

    @Test
    void searchFlights_WithDepartureAndArrival_ShouldReturnFilteredFlights() {

        // Trường hợp: người dùng tìm chuyến bay theo điểm đi và điểm đến
        when(flightRepository.findByDepartureCityAndArrivalCity("Hanoi", "HoChiMinh"))
                .thenReturn(List.of(flight));

        List<FlightResponse> result =
                flightService.searchFlights("Hanoi", "HoChiMinh");

        assertEquals(1, result.size());

        // kiểm tra mapping dữ liệu
        assertEquals("VN123", result.get(0).getFlightNumber());
        assertEquals("Hanoi", result.get(0).getDepartureCity());
        assertEquals("HoChiMinh", result.get(0).getArrivalCity());

        verify(flightRepository)
                .findByDepartureCityAndArrivalCity("Hanoi", "HoChiMinh");
    }

    // ===== TEST: SEARCH WITHOUT FILTER =====

    @Test
    void searchFlights_WithoutDepartureOrArrival_ShouldReturnAllFlights() {

        // Trường hợp: không nhập điểm đi hoặc điểm đến
        when(flightRepository.findAll())
                .thenReturn(List.of(flight));

        List<FlightResponse> result =
                flightService.searchFlights(null, null);

        assertEquals(1, result.size());

        assertEquals("VN123", result.get(0).getFlightNumber());

        verify(flightRepository).findAll();
    }

    // ===== TEST: SEARCH RETURN EMPTY =====

    @Test
    void searchFlights_NoFlightsFound_ShouldReturnEmptyList() {

        // Trường hợp: không tìm thấy chuyến bay nào
        when(flightRepository.findByDepartureCityAndArrivalCity("Hanoi", "Danang"))
                .thenReturn(List.of());

        List<FlightResponse> result =
                flightService.searchFlights("Hanoi", "Danang");

        assertTrue(result.isEmpty());
    }
}
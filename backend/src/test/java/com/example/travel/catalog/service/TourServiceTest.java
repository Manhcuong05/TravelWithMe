package com.example.travel.catalog.service;

import com.example.travel.catalog.dto.TourRequest;
import com.example.travel.catalog.dto.TourResponse;
import com.example.travel.catalog.entity.Tour;
import com.example.travel.catalog.repository.TourRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TourServiceTest {

    @Mock
    private TourRepository tourRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private TourService tourService;

    private Tour tour;
    private TourRequest tourRequest;

    @BeforeEach
    void setUp() {
        tour = Tour.builder()
                .id("1")
                .title("Hạ Long Luxury")
                .location("Quảng Ninh")
                .price(2000000.0)
                .build();

        tourRequest = new TourRequest();
        tourRequest.setTitle("Hạ Long Luxury");
        tourRequest.setLocation("Quảng Ninh");
        tourRequest.setPrice(2000000.0);
    }

    @Test
    void testGetTourById_Success() {
        // White Box: Statement coverage - covering the success path
        when(tourRepository.findById("1")).thenReturn(Optional.of(tour));

        TourResponse response = tourService.getTourById("1");

        assertNotNull(response);
        assertEquals("Hạ Long Luxury", response.getTitle());
        verify(tourRepository, times(1)).findById("1");
    }

    @Test
    void testGetTourById_NotFound() {
        // White Box: Branch coverage - covering the exception path
        when(tourRepository.findById("2")).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            tourService.getTourById("2");
        });

        assertNotNull(exception.getMessage());
        assertTrue(exception.getMessage().contains("ID: 2"));
    }

    @Test
    void testSearchTours_WithLocation() {
        // White Box: Branch coverage - location is not empty
        when(tourRepository.findByLocation("Hanoi")).thenReturn(java.util.List.of(tour));

        var results = tourService.searchTours("Hanoi");

        assertFalse(results.isEmpty());
    }

    @Test
    void testSearchTours_EmptyLocation() {
        // White Box: Branch coverage - location is null or empty
        when(tourRepository.findAll()).thenReturn(java.util.List.of(tour));

        var results = tourService.searchTours("");

        assertFalse(results.isEmpty());
    }
}

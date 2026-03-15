package com.example.travel.catalog.service;

import com.example.travel.catalog.dto.TourResponse;
import com.example.travel.catalog.entity.Tour;
import com.example.travel.catalog.repository.TourRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TourServiceTest {

    @Mock
    private TourRepository tourRepository;

    @InjectMocks
    private TourService tourService;

    private Tour tour;

    @BeforeEach
    void setUp() {

        // Khởi tạo dữ liệu tour mẫu
        tour = new Tour();
        tour.setId("T001");
        tour.setTitle("Hanoi City Tour");
        tour.setDescription("Explore Hanoi");
        tour.setLocation("Hanoi");
        tour.setPrice(2000000);
        tour.setDurationDays(3);
        tour.setHighlights("Hoan Kiem Lake,Old Quarter,Temple of Literature");
    }

    // ===== TEST: SEARCH TOUR BY LOCATION =====

    @Test
    void searchTours_WithLocation_ShouldReturnFilteredTours() {

        // Trường hợp: người dùng tìm tour theo location
        when(tourRepository.findByLocation("Hanoi"))
                .thenReturn(List.of(tour));

        List<TourResponse> result = tourService.searchTours("Hanoi");

        assertEquals(1, result.size());

        // kiểm tra mapping dữ liệu
        assertEquals("Hanoi City Tour", result.get(0).getTitle());
        assertEquals("Hanoi", result.get(0).getLocation());

        verify(tourRepository).findByLocation("Hanoi");
    }

    // ===== TEST: SEARCH ALL TOURS =====

    @Test
    void searchTours_WithoutLocation_ShouldReturnAllTours() {

        // Trường hợp: không nhập location → trả về tất cả tours
        when(tourRepository.findAll())
                .thenReturn(List.of(tour));

        List<TourResponse> result = tourService.searchTours(null);

        assertEquals(1, result.size());
        assertEquals("Hanoi City Tour", result.get(0).getTitle());

        verify(tourRepository).findAll();
    }

    // ===== TEST: SEARCH RETURN EMPTY =====

    @Test
    void searchTours_NoToursFound_ShouldReturnEmptyList() {

        // Trường hợp: không tìm thấy tour nào
        when(tourRepository.findByLocation("Danang"))
                .thenReturn(List.of());

        List<TourResponse> result = tourService.searchTours("Danang");

        assertTrue(result.isEmpty());
    }

    // ===== TEST: HIGHLIGHTS SPLIT =====

    @Test
    void searchTours_ShouldSplitHighlightsCorrectly() {

        // Trường hợp: highlights có nhiều giá trị phân cách bằng dấu ,
        when(tourRepository.findByLocation("Hanoi"))
                .thenReturn(List.of(tour));

        List<TourResponse> result = tourService.searchTours("Hanoi");

        assertEquals(3, result.get(0).getHighlights().size());

        assertEquals("Hoan Kiem Lake", result.get(0).getHighlights().get(0));
        assertEquals("Old Quarter", result.get(0).getHighlights().get(1));
        assertEquals("Temple of Literature", result.get(0).getHighlights().get(2));
    }

    // ===== TEST: HIGHLIGHTS NULL =====

    @Test
    void searchTours_HighlightsNull_ShouldReturnNull() {

        // Trường hợp: highlights = null
        tour.setHighlights(null);

        when(tourRepository.findAll())
                .thenReturn(List.of(tour));

        List<TourResponse> result = tourService.searchTours(null);

        assertNull(result.get(0).getHighlights());
    }
}
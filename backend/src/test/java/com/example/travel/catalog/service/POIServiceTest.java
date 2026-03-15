package com.example.travel.catalog.service;

import com.example.travel.catalog.dto.POIResponse;
import com.example.travel.catalog.entity.POI;
import com.example.travel.catalog.repository.POIRepository;

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
class POIServiceTest {

    @Mock
    private POIRepository poiRepository;

    @InjectMocks
    private POIService poiService;

    private POI poi;

    @BeforeEach
    void setUp() {

        // Khởi tạo dữ liệu POI mẫu
        poi = new POI();
        poi.setId("P001");
        poi.setName("Hoan Kiem Lake");
        poi.setDescription("Famous lake in Hanoi");
        poi.setCategory("Tourist Attraction");
        poi.setAddress("Hoan Kiem District");
        poi.setCity("Hanoi");
        poi.setLatitude(21.0285);
        poi.setLongitude(105.8542);
    }

    // ===== TEST: SEARCH POI BY CITY =====

    @Test
    void searchPOIs_WithCity_ShouldReturnFilteredPOIs() {

        // Trường hợp: người dùng tìm POI theo city
        when(poiRepository.findByCity("Hanoi"))
                .thenReturn(List.of(poi));

        List<POIResponse> result = poiService.searchPOIs("Hanoi");

        assertEquals(1, result.size());
        assertEquals("Hoan Kiem Lake", result.get(0).getName());
        assertEquals("Hanoi", result.get(0).getCity());

        verify(poiRepository).findByCity("Hanoi");
    }

    // ===== TEST: SEARCH ALL POI =====

    @Test
    void searchPOIs_WithoutCity_ShouldReturnAllPOIs() {

        // Trường hợp: không nhập city -> trả về tất cả POI
        when(poiRepository.findAll())
                .thenReturn(List.of(poi));

        List<POIResponse> result = poiService.searchPOIs(null);

        assertEquals(1, result.size());
        assertEquals("Hoan Kiem Lake", result.get(0).getName());

        verify(poiRepository).findAll();
    }

    // ===== TEST: SEARCH RETURN EMPTY =====

    @Test
    void searchPOIs_NoPOIFound_ShouldReturnEmptyList() {

        // Trường hợp: không tìm thấy POI nào trong city
        when(poiRepository.findByCity("Danang"))
                .thenReturn(List.of());

        List<POIResponse> result = poiService.searchPOIs("Danang");

        assertTrue(result.isEmpty());
    }
}
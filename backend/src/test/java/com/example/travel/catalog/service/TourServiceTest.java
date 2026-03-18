package com.example.travel.catalog.service;

import com.example.travel.catalog.dto.TourRequest;
import com.example.travel.catalog.dto.TourResponse;
import com.example.travel.catalog.entity.Tour;
import com.example.travel.catalog.repository.TourRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * KIỂM THỬ HỘP TRẮNG - TourService (Enhanced)
 *
 * Kỹ thuật áp dụng:
 * - Statement Coverage: Đảm bảo mọi câu lệnh được thực thi
 * - Branch Coverage: Kiểm tra nhánh location != null/empty trong searchTours()
 * - Exception Testing: Kiểm tra RuntimeException khi không tìm thấy tour
 * - Path Testing: Các luồng trong deleteTour, updateTour, saveTour
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("TourService - Kiểm thử hộp trắng (Enhanced)")
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
                .highlights("Hang động,Kayak,Cảnh hoàng hôn")
                .build();

        tourRequest = new TourRequest();
        tourRequest.setTitle("Hạ Long Luxury");
        tourRequest.setLocation("Quảng Ninh");
        tourRequest.setPrice(2000000.0);
    }

    // =========================================================
    // GET TOUR BY ID
    // =========================================================

    @Test
    @DisplayName("TC01 - Lấy Tour theo ID thành công - Statement Coverage")
    void testGetTourById_Success() {
        when(tourRepository.findById("1")).thenReturn(Optional.of(tour));

        TourResponse response = tourService.getTourById("1");

        assertNotNull(response);
        assertEquals("Hạ Long Luxury", response.getTitle());
        assertEquals("Quảng Ninh", response.getLocation());
        assertEquals(2000000.0, response.getPrice(), 0.01);
        verify(tourRepository, times(1)).findById("1");
    }

    @Test
    @DisplayName("TC02 - Lấy Tour không tồn tại - Branch & Exception Coverage")
    void testGetTourById_NotFound_ThrowsException() {
        when(tourRepository.findById("999")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> tourService.getTourById("999"));

        assertTrue(exception.getMessage().contains("Không tìm thấy tour"),
                "Message lỗi phải chứa 'Không tìm thấy tour'");
        assertTrue(exception.getMessage().contains("999"));
    }

    // =========================================================
    // SEARCH TOURS - Branch Coverage (location null/empty/value)
    // =========================================================

    @Test
    @DisplayName("TC03 - Tìm kiếm Tour có location - Branch: location != null && !empty")
    void testSearchTours_WithLocation() {
        when(tourRepository.findByLocation("Quảng Ninh")).thenReturn(List.of(tour));

        List<TourResponse> results = tourService.searchTours("Quảng Ninh");

        assertFalse(results.isEmpty());
        assertEquals("Hạ Long Luxury", results.get(0).getTitle());
        verify(tourRepository, times(1)).findByLocation("Quảng Ninh");
        verify(tourRepository, never()).findAll();
    }

    @Test
    @DisplayName("TC04 - Tìm kiếm Tour với location rỗng - Branch: empty string -> findAll()")
    void testSearchTours_EmptyLocation_ReturnsAll() {
        when(tourRepository.findAll()).thenReturn(List.of(tour));

        List<TourResponse> results = tourService.searchTours("");

        assertFalse(results.isEmpty());
        verify(tourRepository, times(1)).findAll();
        verify(tourRepository, never()).findByLocation(anyString());
    }

    @Test
    @DisplayName("TC05 - Tìm kiếm Tour với location null - Branch: null -> findAll()")
    void testSearchTours_NullLocation_ReturnsAll() {
        when(tourRepository.findAll()).thenReturn(List.of(tour));

        List<TourResponse> results = tourService.searchTours(null);

        assertFalse(results.isEmpty());
        verify(tourRepository, times(1)).findAll();
    }

    // =========================================================
    // SAVE TOUR
    // =========================================================

    @Test
    @DisplayName("TC06 - Lưu Tour mới thành công - Statement Coverage")
    void testSaveTour_Success() throws Exception {
        when(objectMapper.writeValueAsString(any())).thenReturn("[]");
        when(tourRepository.save(any(Tour.class))).thenReturn(tour);

        TourResponse response = tourService.saveTour(tourRequest);

        assertNotNull(response);
        assertEquals("Hạ Long Luxury", response.getTitle());
        verify(tourRepository, times(1)).save(any(Tour.class));
    }

    // =========================================================
    // UPDATE TOUR
    // =========================================================

    @Test
    @DisplayName("TC07 - Cập nhật Tour thành công - Statement Coverage")
    void testUpdateTour_Success() throws Exception {
        when(tourRepository.findById("1")).thenReturn(Optional.of(tour));
        when(objectMapper.writeValueAsString(any())).thenReturn("[]");
        when(tourRepository.save(any(Tour.class))).thenReturn(tour);

        TourRequest updatedReq = new TourRequest();
        updatedReq.setTitle("Hạ Long Premium");
        updatedReq.setLocation("Quảng Ninh");
        updatedReq.setPrice(2500000.0);

        TourResponse response = tourService.updateTour("1", updatedReq);

        assertNotNull(response);
        verify(tourRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("TC08 - Cập nhật Tour không tồn tại - Exception Testing")
    void testUpdateTour_NotFound_ThrowsException() {
        when(tourRepository.findById("999")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> tourService.updateTour("999", tourRequest));
    }

    // =========================================================
    // DELETE TOUR
    // =========================================================

    @Test
    @DisplayName("TC09 - Xóa Tour thành công - Statement Coverage")
    void testDeleteTour_Success() {
        when(tourRepository.existsById("1")).thenReturn(true);
        doNothing().when(tourRepository).deleteById("1");

        assertDoesNotThrow(() -> tourService.deleteTour("1"));

        verify(tourRepository, times(1)).deleteById("1");
    }

    @Test
    @DisplayName("TC10 - Xóa Tour không tồn tại - Branch & Exception Coverage")
    void testDeleteTour_NotFound_ThrowsException() {
        when(tourRepository.existsById("999")).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> tourService.deleteTour("999"));

        assertTrue(ex.getMessage().contains("Không tìm thấy tour để xóa"));
        verify(tourRepository, never()).deleteById(any());
    }
}

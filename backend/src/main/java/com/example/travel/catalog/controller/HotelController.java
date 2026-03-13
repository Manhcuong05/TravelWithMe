package com.example.travel.catalog.controller;

import com.example.travel.catalog.dto.HotelResponse;
import com.example.travel.catalog.service.HotelService;
import com.example.travel.core.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @GetMapping
    public ApiResponse<List<HotelResponse>> searchHotels(@RequestParam(required = false) String city) {
        return ApiResponse.success(hotelService.searchHotels(city));
    }

    @GetMapping("/{id}")
    public ApiResponse<HotelResponse> getHotel(@PathVariable String id) {
        return ApiResponse.success(hotelService.getHotelById(id));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<HotelResponse> createHotel(
            @org.springframework.web.bind.annotation.RequestBody com.example.travel.catalog.dto.HotelRequest request) {
        return ApiResponse.success(hotelService.saveHotel(request), "Đã tạo khách sạn thành công");
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<HotelResponse> updateHotel(@PathVariable String id,
            @org.springframework.web.bind.annotation.RequestBody com.example.travel.catalog.dto.HotelRequest request) {
        return ApiResponse.success(hotelService.updateHotel(id, request), "Đã cập nhật khách sạn thành công");
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<Void> deleteHotel(@PathVariable String id) {
        hotelService.deleteHotel(id);
        return ApiResponse.success(null, "Đã xóa khách sạn thành công");
    }
}

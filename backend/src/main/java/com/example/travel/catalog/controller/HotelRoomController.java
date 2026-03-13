package com.example.travel.catalog.controller;

import com.example.travel.catalog.dto.HotelRoomRequest;
import com.example.travel.catalog.dto.HotelRoomResponse;
import com.example.travel.catalog.service.HotelRoomService;
import com.example.travel.core.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class HotelRoomController {

    private final HotelRoomService hotelRoomService;

    @PostMapping("/hotels/{hotelId}/rooms")
    @PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<HotelRoomResponse> addRoom(
            @PathVariable String hotelId,
            @Valid @RequestBody HotelRoomRequest request) {
        return ApiResponse.success(hotelRoomService.addRoom(hotelId, request), "Thêm phòng thành công");
    }

    @PutMapping("/rooms/{roomId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<HotelRoomResponse> updateRoom(
            @PathVariable String roomId,
            @Valid @RequestBody HotelRoomRequest request) {
        return ApiResponse.success(hotelRoomService.updateRoom(roomId, request), "Cập nhật phòng thành công");
    }

    @DeleteMapping("/rooms/{roomId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<Void> deleteRoom(@PathVariable String roomId) {
        hotelRoomService.deleteRoom(roomId);
        return ApiResponse.success(null, "Xóa phòng thành công");
    }
}

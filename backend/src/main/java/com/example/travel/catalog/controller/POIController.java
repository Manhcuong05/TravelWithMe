package com.example.travel.catalog.controller;

import com.example.travel.catalog.dto.POIResponse;
import com.example.travel.catalog.service.POIService;
import com.example.travel.core.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pois")
@RequiredArgsConstructor
public class POIController {

    private final POIService poiService;

    @GetMapping
    public ApiResponse<List<POIResponse>> searchPOIs(@RequestParam(required = false) String city) {
        return ApiResponse.success(poiService.searchPOIs(city));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<POIResponse> createPOI(
            @org.springframework.web.bind.annotation.RequestBody com.example.travel.catalog.dto.POIRequest request) {
        return ApiResponse.success(poiService.savePOI(request), "Đã tạo địa điểm tham quan thành công");
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<POIResponse> updatePOI(@PathVariable String id,
            @org.springframework.web.bind.annotation.RequestBody com.example.travel.catalog.dto.POIRequest request) {
        return ApiResponse.success(poiService.updatePOI(id, request), "Đã cập nhật địa điểm tham quan thành công");
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<Void> deletePOI(@PathVariable String id) {
        poiService.deletePOI(id);
        return ApiResponse.success(null, "Đã xóa địa điểm tham quan thành công");
    }
}

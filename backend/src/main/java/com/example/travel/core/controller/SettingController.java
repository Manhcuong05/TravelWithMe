package com.example.travel.core.controller;

import com.example.travel.core.entity.SystemSetting;
import com.example.travel.core.repository.SystemSettingRepository;
import com.example.travel.core.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingController {

    private final SystemSettingRepository repository;

    @GetMapping("/{key}")
    public ApiResponse<String> getSetting(@PathVariable String key) {
        return repository.findById(key)
                .map(setting -> ApiResponse.success(setting.getValue(), "Lấy cấu hình thành công"))
                .orElse(ApiResponse.success(null, "Không tìm thấy cấu hình"));
    }

    @PutMapping("/{key}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<String> updateSetting(@PathVariable String key, @RequestBody SettingRequest request) {
        SystemSetting setting = repository.findById(key)
                .orElse(SystemSetting.builder().id(key).build());
        
        setting.setValue(request.getValue());
        repository.save(setting);
        
        return ApiResponse.success(request.getValue(), "Cập nhật cấu hình " + key + " thành công");
    }

    @lombok.Data
    public static class SettingRequest {
        private String value;
    }
}

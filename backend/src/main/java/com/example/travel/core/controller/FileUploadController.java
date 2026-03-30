package com.example.travel.core.controller;

import com.example.travel.core.entity.SystemSetting;
import com.example.travel.core.repository.SystemSettingRepository;
import com.example.travel.core.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@Slf4j
@RequiredArgsConstructor
public class FileUploadController {

    private final SystemSettingRepository settingRepository;
    private final String uploadDir = "uploads/";

    @PostMapping
    public ApiResponse<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "settingKey", required = false) String settingKey) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String extension = originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";
            String fileName = UUID.randomUUID().toString() + extension;

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/" + fileName;

            // Nếu có settingKey, cập nhật vào database
            if (settingKey != null && !settingKey.isEmpty()) {
                SystemSetting setting = settingRepository.findById(settingKey)
                        .orElse(new SystemSetting(settingKey, fileUrl));
                setting.setValue(fileUrl);
                settingRepository.save(setting);
                log.info("Updated system_setting {} with value {}", settingKey, fileUrl);
            }

            return ApiResponse.success(fileUrl, "Upload thành công");
        } catch (IOException ex) {
            log.error("Could not store file", ex);
            throw new RuntimeException("Lỗi upload file: " + ex.getMessage());
        }
    }
}

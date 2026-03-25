package com.example.travel.catalog.controller;

import com.example.travel.ai_itinerary.service.GeminiService;
import com.example.travel.core.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/catalog/ai")
@RequiredArgsConstructor
public class AIHandbookController {

    private final GeminiService geminiService;

    @GetMapping("/generate-handbook")
    public ApiResponse<String> generateHandbook(@RequestParam String poiName, @RequestParam String city) {
        String prompt = String.format(
            "Bạn là một chuyên gia du lịch cao cấp. Hãy viết cẩm nang du lịch cho địa điểm '%s' tại '%s'.\n" +
            "Yêu cầu trả về định dạng JSON với các trường sau (không trả thêm văn bản nào khác ngoài JSON):\n" +
            "- logistics: Cách di chuyển đến đó (ngắn gọn, xúc tích).\n" +
            "- accommodation: Gợi ý các loại hình lưu trú phù hợp xung quanh.\n" +
            "- discovery: Danh sách các điểm tham quan nhỏ bên trong hoặc hoạt động trải nghiệm. Format mỗi dòng là \"Tên: Mô tả ngắn\". Dùng dấu xuống dòng giữa các mục.\n" +
            "- culinary: Các món ăn đặc sản nên thử tại đây.\n" +
            "- itinerary: Lịch trình gợi ý (N1: ..., N2: ...). Mỗi ngày một dòng.\n" +
            "- tips: Các lưu ý quan trọng. Mỗi lưu ý một dòng.\n\n" +
            "Ngôn ngữ: Tiếng Việt. Phong cách: Sang trọng, chuyên nghiệp.",
            poiName, city
        );

        String result = geminiService.generateItinerary(prompt);
        return ApiResponse.success(result, "Đã tạo nội dung cẩm nang tự động");
    }
}

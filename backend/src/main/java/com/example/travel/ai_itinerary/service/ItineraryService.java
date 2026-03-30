package com.example.travel.ai_itinerary.service;

import com.example.travel.ai_itinerary.dto.ItineraryResponse;
import com.example.travel.ai_itinerary.entity.Itinerary;
import com.example.travel.ai_itinerary.repository.ItineraryRepository;
import com.example.travel.core.exception.BusinessException;
import com.example.travel.core.util.SecurityUtil;
import com.example.travel.identity.entity.User;
import com.example.travel.identity.repository.UserRepository;
import com.example.travel.catalog.repository.TourRepository;
import com.example.travel.catalog.repository.HotelRepository;
import com.example.travel.catalog.repository.POIRepository;
import com.example.travel.catalog.entity.Tour;
import com.example.travel.catalog.entity.Hotel;
import com.example.travel.catalog.entity.POI;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ItineraryService {

        private final GeminiService geminiService;
        private final ItineraryRepository itineraryRepository;
        private final UserRepository userRepository;
        private final TourRepository tourRepository;
        private final HotelRepository hotelRepository;
        private final POIRepository poiRepository;
        private final ObjectMapper objectMapper;

        public ItineraryResponse createItinerary(String destination, Integer days, String preferences) {
                String userEmail = SecurityUtil.getCurrentUserEmail();
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> {
                                        log.error("User not found for email: {}", userEmail);
                                        return new BusinessException("USER_NOT_FOUND", "Người dùng không tồn tại");
                                });

                log.info("Generating itinerary for destination: {}, days: {}", destination, days);
                String fullSearchQuery = destination + " " + (preferences != null ? preferences : "");

                // Fetch context from database with broader search
                List<Tour> relatedTours = tourRepository.findByLocationContainingIgnoreCase(destination);
                if (preferences != null && !preferences.isBlank()) {
                        List<Tour> prefTours = tourRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(preferences, preferences);
                        relatedTours.addAll(prefTours);
                }
                relatedTours = relatedTours.stream().distinct().limit(10).collect(Collectors.toList());

                List<Hotel> relatedHotels = hotelRepository.findByCityContainingIgnoreCase(destination);
                List<POI> relatedPois = poiRepository.findByCityContainingIgnoreCase(destination);

                StringBuilder contextBuilder = new StringBuilder();
                contextBuilder.append("\nDỮ LIỆU THỰC TẾ TRONG HỆ THỐNG CỦA CHÚNG TÔI (Hãy ưu tiên sử dụng các ID này):\n");

                contextBuilder.append("- ĐỊA DANH (POI): ");
                relatedPois.forEach(p -> contextBuilder.append(p.getName()).append(" (ID: ").append(p.getId()).append("), "));

                contextBuilder.append("\n- KHÁCH SẠN: ");
                relatedHotels.forEach(h -> contextBuilder.append(h.getName()).append(" (ID: ").append(h.getId()).append("), "));

                contextBuilder.append("\n- TOURS TRẢI NGHIỆM: ");
                relatedTours.forEach(t -> contextBuilder.append(t.getTitle()).append(" - ").append(t.getLocation()).append(" (ID: ").append(t.getId()).append("), "));

                if (relatedPois.isEmpty() && relatedHotels.isEmpty() && relatedTours.isEmpty()) {
                        contextBuilder.append(
                                        "\nLƯU Ý QUAN TRỌNG: Hiện tại hệ thống KHÔNG có dữ liệu thực tế nào cho địa điểm này. Vui lòng để danh sách 'recommendations' TRỐNG [].\n");
                }

                String prompt = String.format(
                                "Hãy đóng vai một chuyên gia du lịch cao cấp. Lập lịch trình %d ngày tại %s. " +
                                                "Sở thích khách hàng: %s. %s\n\n" +
                                                "YÊU CẦU NGHIÊM NGẶT: \n" +
                                                "1. Trả về duy nhất định dạng JSON.\n" +
                                                "2. Trong phần 'recommendations', CHỈ được sử dụng các ID đã cung cấp ở trên. TUYỆT ĐỐI không tự chế ID giả.\n"
                                                +
                                                "3. Nếu không có ID thật nào từ dữ liệu phía trên phù hợp, hãy để 'recommendations': [].\n"
                                                +
                                                "4. Cấu trúc JSON: { \n" +
                                                "  \"title\": \"...\", \n" +
                                                "  \"days\": [ { \"day\": 1, \"activities\": [ { \"time\": \"08:00\", \"activity\": \"...\", \"location\": \"...\", \"notes\": \"...\" } ] } ],\n"
                                                +
                                                "  \"recommendations\": [ { \"id\": \"...\", \"type\": \"TOUR|HOTEL|POI\", \"name\": \"...\" } ]\n"
                                                +
                                                "}",
                                days, destination, preferences, contextBuilder.toString());

                String rawJson = geminiService.generateItinerary(prompt);
                log.info("Gemini raw response generated for {}", destination);

                Itinerary itinerary = Itinerary.builder()
                                .userId(user.getId())
                                .destination(destination)
                                .durationDays(days)
                                .userPreferences(preferences)
                                .generatedContentJson(rawJson)
                                .saved(false)
                                .build();

                Itinerary saved = itineraryRepository.save(itinerary);
                return mapToResponse(saved);
        }

        public List<ItineraryResponse> getUserItineraries() {
                String userEmail = SecurityUtil.getCurrentUserEmail();
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "Người dùng không tồn tại"));
                return itineraryRepository.findByUserId(user.getId()).stream()
                                .filter(it -> it.getSaved() != null && it.getSaved())
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Transactional
        public ItineraryResponse saveItinerary(String id) {
                Itinerary itinerary = itineraryRepository.findById(id)
                                .orElseThrow(() -> new BusinessException("NOT_FOUND", "Không tìm thấy lịch trình"));
                itinerary.setSaved(true);
                return mapToResponse(itineraryRepository.save(itinerary));
        }

        public ItineraryResponse getItinerary(String id) {
                Itinerary itinerary = itineraryRepository.findById(id)
                                .orElseThrow(() -> new BusinessException("NOT_FOUND", "Không tìm thấy lịch trình"));
                return mapToResponse(itinerary);
        }

        private ItineraryResponse mapToResponse(Itinerary itinerary) {
                String title = null;
                List<ItineraryResponse.DayPlan> days = null;
                ItineraryResponse.ItineraryContent content = null;
                try {
                        String cleanJson = extractJson(itinerary.getGeneratedContentJson());
                        content = objectMapper.readValue(cleanJson,
                                        ItineraryResponse.ItineraryContent.class);
                        if (content != null) {
                                title = content.getTitle();
                                days = content.getDays();
                        }
                } catch (Exception e) {
                        log.error("Error parsing itinerary JSON. Raw content: {}", itinerary.getGeneratedContentJson(),
                                        e);
                }

                return ItineraryResponse.builder()
                                .id(itinerary.getId())
                                .destination(itinerary.getDestination())
                                .durationDays(itinerary.getDurationDays())
                                .userPreferences(itinerary.getUserPreferences())
                                .title(title)
                                .days(days)
                                .recommendations(content != null ? content.getRecommendations() : null)
                                .saved(itinerary.getSaved() != null && itinerary.getSaved())
                                .build();
        }

        private String extractJson(String raw) {
                if (raw == null)
                        return null;
                String cleaned = raw.trim();
                if (cleaned.startsWith("```json")) {
                        cleaned = cleaned.substring(7);
                } else if (cleaned.startsWith("```")) {
                        cleaned = cleaned.substring(3);
                }
                if (cleaned.endsWith("```")) {
                        cleaned = cleaned.substring(0, cleaned.length() - 3);
                }
                cleaned = cleaned.trim();

                int firstBrace = cleaned.indexOf("{");
                int lastBrace = cleaned.lastIndexOf("}");
                if (firstBrace >= 0 && lastBrace > firstBrace) {
                        return cleaned.substring(firstBrace, lastBrace + 1);
                }
                return cleaned;
        }
}

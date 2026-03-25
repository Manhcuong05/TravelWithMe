package com.example.travel.ai_itinerary.service;

import com.example.travel.ai_itinerary.dto.ItineraryResponse;
import com.example.travel.ai_itinerary.entity.Itinerary;
import com.example.travel.ai_itinerary.repository.ItineraryRepository;
import com.example.travel.core.exception.BusinessException;
import com.example.travel.core.util.SecurityUtil;
import com.example.travel.identity.entity.User;
import com.example.travel.identity.repository.UserRepository;
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
        private final ObjectMapper objectMapper;

        public ItineraryResponse createItinerary(String destination, Integer days, String preferences) {
                String userEmail = SecurityUtil.getCurrentUserEmail();
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> {
                                        log.error("User not found for email: {}", userEmail);
                                        return new BusinessException("USER_NOT_FOUND", "Người dùng không tồn tại");
                                });

                log.info("Generating itinerary for destination: {}, days: {}", destination, days);

                String prompt = String.format(
                                "Hãy đóng vai một chuyên gia du lịch. Lập lịch trình %d ngày tại %s. " +
                                                "Sở thích: %s. " +
                                                "YÊU CẦU: Trả về duy nhất định dạng JSON, không văn bản dư thừa. " +
                                                "Cấu trúc JSON: { \"title\": \"...\", \"days\": [ { \"day\": 1, \"activities\": [ { \"time\": \"08:00\", \"activity\": \"...\", \"location\": \"...\", \"notes\": \"...\" } ] } ] }",
                                days, destination, preferences);

                String rawJson = geminiService.generateItinerary(prompt);
                log.info("Gemini raw response length: {}", rawJson != null ? rawJson.length() : 0);
                log.debug("Gemini raw response: {}", rawJson);

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
                try {
                        String cleanJson = extractJson(itinerary.getGeneratedContentJson());
                        ItineraryResponse.ItineraryContent content = objectMapper.readValue(cleanJson,
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

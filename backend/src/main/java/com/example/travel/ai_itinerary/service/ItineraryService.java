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

        public ItineraryResponse createItinerary(String destination, int days, String preferences) {
                String userEmail = SecurityUtil.getCurrentUserEmail();
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "Người dùng không tồn tại"));

                String prompt = String.format(
                                "Bạn là chuyên gia du lịch của TravelWithMe. Hãy lập lịch trình du lịch cho %d ngày tại %s. "
                                                +
                                                "Sở thích của tôi: %s. " +
                                                "Hãy trả về kết quả dưới định dạng JSON có cấu trúc: { \"title\": \"...\", \"days\": [ { \"day\": 1, \"activities\": [...] } ] }",
                                days, destination, preferences);

                String rawJson = geminiService.generateItinerary(prompt);

                // In a real app, you would parse the specific JSON from Gemini's full response.
                // For this demo, we store the full response as the generated JSON.

                Itinerary itinerary = Itinerary.builder()
                                .userId(user.getId())
                                .destination(destination)
                                .durationDays(days)
                                .userPreferences(preferences)
                                .generatedContentJson(rawJson)
                                .build();

                Itinerary saved = itineraryRepository.save(itinerary);
                return mapToResponse(saved);
        }

        public List<ItineraryResponse> getUserItineraries() {
                String userEmail = SecurityUtil.getCurrentUserEmail();
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "Người dùng không tồn tại"));
                return itineraryRepository.findByUserId(user.getId()).stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        private ItineraryResponse mapToResponse(Itinerary itinerary) {
                ItineraryResponse.ItineraryContent content = null;
                try {
                        content = objectMapper.readValue(itinerary.getGeneratedContentJson(),
                                        ItineraryResponse.ItineraryContent.class);
                } catch (Exception e) {
                        log.error("Error parsing itinerary JSON", e);
                }

                return ItineraryResponse.builder()
                                .id(itinerary.getId())
                                .destination(itinerary.getDestination())
                                .durationDays(itinerary.getDurationDays())
                                .userPreferences(itinerary.getUserPreferences())
                                .content(content)
                                .build();
        }
}

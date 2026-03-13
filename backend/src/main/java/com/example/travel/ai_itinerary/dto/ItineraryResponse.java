package com.example.travel.ai_itinerary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryResponse {
    private String id;
    private String destination;
    private int durationDays;
    private String userPreferences;
    private String title;
    private List<DayPlan> days;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItineraryContent {
        private String title;
        private List<DayPlan> days;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DayPlan {
        private int day;
        private List<ActivityDetails> activities;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActivityDetails {
        private String time;
        private String activity;
        private String location;
        private String notes;
    }
}

package com.example.travel.ai_itinerary.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "itineraries", indexes = @Index(columnList = "userId"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Itinerary {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId;

    private String destination;

    private Integer durationDays;

    @Column(columnDefinition = "TEXT")
    private String userPreferences; // User's custom request/preferences

    @Column(columnDefinition = "TEXT")
    private String generatedContentJson; // The JSON itinerary returned by Gemini

    @Builder.Default
    private Boolean saved = false;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

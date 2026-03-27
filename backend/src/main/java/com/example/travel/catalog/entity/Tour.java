package com.example.travel.catalog.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tours")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(name = "tour_type")
    private String tourType; // e.g., "Gia Đình", "Sinh Viên", "Luxury"

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    // Tọa độ địa lý - dùng cho Google Maps & Street View
    private Double latitude;
    private Double longitude;
    private String streetViewUrl; // URL tùy chỉnh nếu muốn nhúng Street View cụ thể

    private double price;

    private int durationDays;

    private String highlights; // Key features of the tour

    @Column(columnDefinition = "TEXT")
    private String itineraryJson; // Day-by-day description of the tour

    @Column(columnDefinition = "TEXT")
    private String imagesJson;

    // Combo Features
    private String hotelId;
    private String flightId;
    @Column(columnDefinition = "TEXT")
    private String poiIds; // Comma-separated or JSON list of POI IDs
    @Column(columnDefinition = "TEXT")
    private String aiSuggestions;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

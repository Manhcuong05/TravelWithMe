package com.example.travel.catalog.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hotels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String address;
    private String city;
    private String country;

    // Tọa độ địa lý - dùng cho Google Maps & Street View
    private Double latitude;
    private Double longitude;
    private String streetViewUrl; // URL tùy chỉnh nếu muốn nhúng Street View cụ thể

    private double rating;
    private int starRating; // 1-5 stars

    @Column(columnDefinition = "TEXT")
    private String imagesJson; // List of image URLs

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

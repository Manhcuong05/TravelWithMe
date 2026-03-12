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

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    private double price;

    private int durationDays;

    private String highlights; // Key features of the tour

    @Column(columnDefinition = "TEXT")
    private String itineraryJson; // Day-by-day description of the tour

    @Column(columnDefinition = "TEXT")
    private String imagesJson;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

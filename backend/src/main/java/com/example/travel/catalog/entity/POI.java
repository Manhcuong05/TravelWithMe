package com.example.travel.catalog.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pois")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class POI {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category; // e.g. Museum, Park, Beach, Historical

    private String address;
    private String city;

    private double latitude;
    private double longitude;

    @Column(columnDefinition = "TEXT")
    private String imagesJson;

    private double averageSpend; // Average spending at this location
}

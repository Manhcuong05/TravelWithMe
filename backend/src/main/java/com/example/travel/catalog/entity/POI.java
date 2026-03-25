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

    private String region; // Miền Bắc / Trung / Nam (NORTH, CENTRAL, SOUTH)
    private String bestTimeToVisit; // Thời điểm lý tưởng
    @Column(columnDefinition = "TEXT")
    private String tips; // Mẹo du lịch / Lưu ý (Hướng dẫn dài)
    private Double rating; // Đánh giá sao (VD: 4.8)

    private String address;
    private String city;

    private double latitude;
    private double longitude;

    @Column(columnDefinition = "TEXT")
    private String imagesJson;

    @Column(columnDefinition = "TEXT")
    private String handbookJson;

    private double averageSpend; // Average spending at this location
}

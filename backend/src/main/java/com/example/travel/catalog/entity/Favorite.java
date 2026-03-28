package com.example.travel.catalog.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "favorites", indexes = {
    @Index(columnList = "userId"),
    @Index(columnList = "itemType"),
    @Index(columnList = "itemId")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String itemType; // TOUR, HOTEL, POI, ITINERARY

    @Column(nullable = false)
    private String itemId;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

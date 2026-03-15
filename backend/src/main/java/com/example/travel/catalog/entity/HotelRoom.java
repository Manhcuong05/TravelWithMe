package com.example.travel.catalog.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hotel_rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HotelRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    @Column(nullable = false)
    private String roomType; // e.g. Single, Double, Deluxe

    private double pricePerNight;

    private int capacity; // Number of people

    private int totalRooms; // Number of rooms of this type available in the hotel

    @Column(columnDefinition = "TEXT")
    private String amenitiesJson; // wifi, breakfast, air_con, etc.

    @Column(name = "classification")
    private String classification; // STANDARD, BEST_VALUE, PREMIUM, LUXURY
}

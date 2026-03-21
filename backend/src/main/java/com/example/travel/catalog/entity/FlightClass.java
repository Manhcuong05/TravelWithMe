package com.example.travel.catalog.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "flight_classes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightClass {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Column(nullable = false)
    private String className; // e.g. "ECONOMY", "BUSINESS", "FIRST_CLASS"

    @Column(nullable = false)
    private double priceAdult;

    @Column(nullable = false)
    private double priceChild;

    @Column(nullable = false)
    private double priceInfant;

    @Column(nullable = false)
    private int totalSeats;

    @Column(nullable = false)
    private int availableSeats;

    // e.g. 7, 23, 30 kg depending on class
    private int baggageAllowanceKg;
}

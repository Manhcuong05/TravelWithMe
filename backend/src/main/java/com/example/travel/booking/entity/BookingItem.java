package com.example.travel.booking.entity;

import com.example.travel.catalog.dto.ServiceType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "booking_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceType serviceType;

    @Column(nullable = false)
    private String serviceId; // ID of HotelRoom, Flight, or Tour

    private int quantity;

    private double priceAtBooking; // Snapshot of price at the time of booking

    private LocalDate checkInDate;

    private LocalDate checkOutDate;
}

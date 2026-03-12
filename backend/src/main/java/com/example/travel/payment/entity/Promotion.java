package com.example.travel.payment.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "promotions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String code;

    private String description;

    private double discountPercent; // e.g. 10 for 10%

    private double maxDiscountAmount;

    private LocalDateTime validFrom;

    private LocalDateTime validTo;

    private int usageLimit;

    private int usedCount;

    private boolean active;
}

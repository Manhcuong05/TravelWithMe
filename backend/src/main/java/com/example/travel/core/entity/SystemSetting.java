package com.example.travel.core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "system_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemSetting {

    @Id
    private String id; // The key, e.g., "SUPPORT_AVATAR"

    @Column(columnDefinition = "TEXT")
    private String value;
}

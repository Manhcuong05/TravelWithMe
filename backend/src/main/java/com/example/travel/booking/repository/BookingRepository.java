package com.example.travel.booking.repository;

import com.example.travel.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByUserId(String userId);

    @Query("SELECT DISTINCT b FROM Booking b LEFT JOIN FETCH b.items WHERE b.createdAt BETWEEN :start AND :end AND b.status IN :statuses")
    List<Booking> findAllForRevenueReport(LocalDateTime start, LocalDateTime end, Collection<Booking.BookingStatus> statuses);
}

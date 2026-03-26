package com.example.travel.booking.repository;

import com.example.travel.booking.entity.BookingItem;
import com.example.travel.catalog.dto.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingItemRepository extends JpaRepository<BookingItem, String> {

        @Query("SELECT COALESCE(SUM(bi.quantity), 0) FROM BookingItem bi " +
                        "WHERE bi.serviceId = :serviceId " +
                        "AND bi.serviceType = :serviceType " +
                        "AND bi.checkInDate < :checkOutDate " +
                        "AND bi.checkOutDate > :checkInDate " +
                        "AND bi.booking.status NOT IN ('CANCELLED', 'REFUNDED')")
        int countBookedQuantityInRange(@Param("serviceId") String serviceId,
                        @Param("serviceType") ServiceType serviceType,
                        @Param("checkInDate") LocalDate checkInDate,
                        @Param("checkOutDate") LocalDate checkOutDate);

        @Query("SELECT bi FROM BookingItem bi " +
                        "WHERE bi.serviceType = 'TOUR' " +
                        "AND bi.checkOutDate = :date " +
                        "AND bi.booking.status NOT IN ('CANCELLED', 'REFUNDED')")
        List<BookingItem> findTourItemsByCheckOutDate(@Param("date") LocalDate date);
}

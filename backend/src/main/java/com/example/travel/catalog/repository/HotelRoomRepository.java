package com.example.travel.catalog.repository;

import com.example.travel.catalog.entity.HotelRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRoomRepository extends JpaRepository<HotelRoom, String> {
    List<HotelRoom> findByHotelId(String hotelId);
}

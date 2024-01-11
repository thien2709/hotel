package com.thienht.mini_hotel.repository;

import com.thienht.mini_hotel.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    @Query("SELECT DISTINCT r.roomType FROM Room r")
    List<String> getAllRommTypes();

    @Query("SELECT r from Room r WHERE r.roomType LIKE %?1%" +
            "AND r.id NOT IN (" +
            "SELECT br.room.id FROM BookedRoom br " +
            "WHERE br.checkInDate <= ?3 AND br.checkOutDate >= ?2 " +
            "OR br.checkInDate BETWEEN ?2 AND ?3" +
            "OR br.checkOutDate BETWEEN ?2 AND ?3" +
            ")")
    List<Room> findRoomsAvaiable(String roomType, LocalDate checkInDate, LocalDate checkOutDate);
}

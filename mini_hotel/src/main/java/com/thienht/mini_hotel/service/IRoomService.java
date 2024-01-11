package com.thienht.mini_hotel.service;

import com.thienht.mini_hotel.model.Room;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IRoomService {
    Room createRoom(MultipartFile photo, String roomType, BigDecimal roomPrice) throws IOException, SQLException;

    List<String> getAllRoomTypes();

    List<Room> getRooms();

    byte[] getRoomPhotoByRoomId(Long id) throws SQLException;

    void deleteRoom(Long roomId);

    Optional<Room> getRoom(Long id);

    Room updateRoom(Long id, String roomType, BigDecimal roomPrice, byte[] photo);

    List<Room> findRoomAvaiable(String roomType, LocalDate checkOutDate, LocalDate checkOutDate1);
}

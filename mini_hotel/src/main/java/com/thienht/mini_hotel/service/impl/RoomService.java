package com.thienht.mini_hotel.service.impl;

import com.thienht.mini_hotel.exception.InteralServerException;
import com.thienht.mini_hotel.exception.ResourceNotFoundException;
import com.thienht.mini_hotel.model.Room;
import com.thienht.mini_hotel.repository.RoomRepository;
import com.thienht.mini_hotel.service.IRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class RoomService implements IRoomService {
    private final RoomRepository roomRepository;

    @Override
    public Room createRoom(MultipartFile file, String roomType, BigDecimal roomPrice) throws IOException, SQLException {
        Room room = new Room();
        room.setRoomType(roomType);
        room.setRoomPrice(roomPrice);
        if (!file.isEmpty()) {
            byte[] photoBytes = file.getBytes();
            Blob photoBlob = new SerialBlob(photoBytes);
            room.setPhoto(photoBlob);
        }
        return roomRepository.save(room);
    }

    @Override
    public List<String> getAllRoomTypes() {
        return roomRepository.getAllRommTypes();
    }

    @Override
    public List<Room> getRooms() {
        return roomRepository.findAll();
    }

    @Override
    public byte[] getRoomPhotoByRoomId(Long id) throws SQLException {
        Optional<Room> theRoom = roomRepository.findById(id);
        if (theRoom.isEmpty()) {
            throw new ResourceNotFoundException("Room not exists");
        }
        Blob photoBlob = theRoom.get().getPhoto();
        if (photoBlob != null) {
            return photoBlob.getBytes(1, (int) photoBlob.length());
        }
        return null;
    }

    @Override
    public void deleteRoom(Long roomId) {
        Optional<Room> theRoom = roomRepository.findById(roomId);
        if (theRoom.isPresent()) {
            roomRepository.deleteById(roomId);
        }
    }

    @Override
    public Optional<Room> getRoom(Long id) {
        return roomRepository.findById(id);
    }

    @Override
    public Room updateRoom(Long id, String roomType, BigDecimal roomPrice, byte[] photo) {
        Room room = getRoom(id).get();
        if (roomType != null) {
            room.setRoomType(roomType);
        }
        if (roomPrice != null) {
            room.setRoomPrice(roomPrice);
        }
        if (photo.length > 0) {
            try {
                room.setPhoto(new SerialBlob(photo));
            } catch (SQLException e) {
                throw new InteralServerException("Error updating room");
            }
        }
        return roomRepository.save(room);
    }

    @Override
    public List<Room> findRoomAvaiable(String roomType, LocalDate checkInDate, LocalDate checkOutDate) {
        return roomRepository.findRoomsAvaiable(roomType, checkInDate, checkOutDate );
    }
}

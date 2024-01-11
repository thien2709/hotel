package com.thienht.mini_hotel.controller;

import com.thienht.mini_hotel.dto.BookingResponse;
import com.thienht.mini_hotel.dto.RoomResponse;
import com.thienht.mini_hotel.exception.PhotoRetrievalException;
import com.thienht.mini_hotel.exception.ResourceNotFoundException;
import com.thienht.mini_hotel.model.BookedRoom;
import com.thienht.mini_hotel.model.Room;
import com.thienht.mini_hotel.service.IBookingService;
import com.thienht.mini_hotel.service.IRoomService;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {

    private final IRoomService roomService;
    private final IBookingService bookingService;

    @PostMapping("/create-room")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<RoomResponse> createRoom(@RequestParam("photo") MultipartFile photo, @RequestParam("roomType") String roomType, @RequestParam("roomPrice") BigDecimal roomPrice) throws SQLException, IOException {
        Room savedRoom = roomService.createRoom(photo, roomType, roomPrice);
        RoomResponse response = new RoomResponse(savedRoom.getId(), savedRoom.getRoomType(), savedRoom.getRoomPrice());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/room-types")
    public List<String> getRoomTypes() {
        return roomService.getAllRoomTypes();
    }

    @GetMapping("/all-rooms")
    public ResponseEntity<List<RoomResponse>> getAllRooms() throws SQLException {
        List<Room> rooms = roomService.getRooms();
        List<RoomResponse> roomsResponse = new ArrayList<>();
        for (Room room : rooms) {
            byte[] photoBytes = roomService.getRoomPhotoByRoomId(room.getId());
            if (photoBytes != null && photoBytes.length > 0) {
                String base64Photo = Base64.encodeBase64String(photoBytes);
                RoomResponse roomResponse = getRoomResponse(room);
                roomResponse.setPhoto(base64Photo);
                roomsResponse.add(roomResponse);
            }
        }
        return ResponseEntity.ok(roomsResponse);
    }

    @DeleteMapping("/room/delete-room/{roomId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId) {
        roomService.deleteRoom(roomId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/room/{id}")
    public ResponseEntity<?> getRoom(@PathVariable Long id) {
        try {
            Optional<Room> theRoom = roomService.getRoom(id);
            return theRoom.map(room -> {
                RoomResponse roomResponse = getRoomResponse(room);
                return ResponseEntity.ok(Optional.of(roomResponse));
            }).orElseThrow(() -> new ResourceNotFoundException("Room not exist"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/update-room/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<RoomResponse> updateRoom(@PathVariable Long id,
                                                   @RequestParam(required = false) String roomType,
                                                   @RequestParam(required = false) BigDecimal roomPrice,
                                                   @RequestParam(required = false) MultipartFile photo
    ) throws IOException, SQLException {
        Room room = !photo.isEmpty()
                ? roomService.updateRoom(id, roomType, roomPrice, photo.getBytes())
                : roomService.updateRoom(id, roomType, roomPrice, roomService.getRoomPhotoByRoomId(id));
        RoomResponse roomResponse = getRoomResponse(room);
        roomResponse.setPhoto(Base64.encodeBase64String(roomService.getRoomPhotoByRoomId(id)));
        return ResponseEntity.ok(roomResponse);
    }

    @GetMapping("/avaiable")
    public ResponseEntity<List<RoomResponse>> getAvaiableRooms(
            @RequestParam("roomType") String roomType,
            @RequestParam("checkInDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam("checkOutDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate
    ) throws SQLException {
        List<Room> rooms = roomService.findRoomAvaiable(roomType, checkInDate, checkOutDate);
        List<RoomResponse> roomsAvaiable = new ArrayList<>();
        for (Room room : rooms) {
            RoomResponse roomResponse = getRoomResponse(room);
            roomResponse.setPhoto(Base64.encodeBase64String(roomService.getRoomPhotoByRoomId(room.getId())));
            roomsAvaiable.add(roomResponse);
        }
        if (roomsAvaiable.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(roomsAvaiable);
        }
    }

    private RoomResponse getRoomResponse(Room room) {
        List<BookedRoom> bookings = bookingService.getBookingsByRoomId(room.getId());
        List<BookingResponse> bookingInfo = bookings.stream().map(booking ->
                new BookingResponse(booking.getBookingId(),
                        booking.getCheckInDate(),
                        booking.getCheckOutDate(),
                        booking.getBookingConfirmationCode())).toList();
        byte[] photoBytes = null;
        Blob photoBlob = room.getPhoto();
        if (photoBlob != null) {
            try {
                photoBytes = photoBlob.getBytes(1, (int) photoBlob.length());
            } catch (SQLException e) {
                throw new PhotoRetrievalException("Error retrieving photo");
            }
        }
        return new RoomResponse(room.getId(),
                room.getRoomType(),
                room.getRoomPrice(),
                room.isBooked(), photoBytes, bookingInfo);
    }
}

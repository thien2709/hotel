package com.thienht.mini_hotel.service;

import com.thienht.mini_hotel.model.BookedRoom;

import java.util.List;

public interface IBookingService {
    List<BookedRoom> getBookingsByRoomId(Long id);

    List<BookedRoom> getBookings();

    BookedRoom getBookingByConfirmationCode(String confirmationCode);

    String saveBooking(Long roomId, BookedRoom bookingRequest);

    void cancelBooking(Long bookingId);

    List<BookedRoom> getBookingsByUserEmail(String email);
}

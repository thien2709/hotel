import React, { useEffect, useState } from 'react'
import DateSlider from './DateSlider'
import { parseISO } from 'date-fns'

const BookingsTable = ({ bookingInfo, handleBookingCancellation }) => {
    const [filteredBookings, setFilteredBooking] = useState(bookingInfo)

    const filterBookings = (startDate, endDate) => {
        let filterd = bookingInfo
        if (startDate && endDate) {
            filterd = bookingInfo.filter((booking) => {
                const bookingsStartDate = parseISO(booking.checkInDate)
                const bookingsSEndDate = parseISO(booking.checkOutDate)
                return bookingsStartDate >= startDate && bookingsSEndDate <= endDate
                    && bookingsSEndDate > startDate
            })
        }
        setFilteredBooking(filterd)
    }

    useEffect(() => {
        setFilteredBooking(bookingInfo)
    }, [bookingInfo])

    return (
        <section className='p-4'>
            <DateSlider onDateChange={filterBookings} onFilterChange={filterBookings} />
            <table className='table table-border table-hover shadow'>
                <thead className='text-center'>
                    <tr>
                        <th>#</th>
                        <th>Booking ID</th>
                        <th>Room ID</th>
                        <th>Room Type</th>
                        <th>Check-In Date</th>
                        <th>Check-Out-Date</th>
                        <th>Guest Name</th>
                        <th>Guest Email</th>
                        <th>Adults</th>
                        <th>Children</th>
                        <th>Total Guest</th>
                        <th>Confirmation Code</th>
                        <th colSpan={2}>Actions</th>
                    </tr>
                </thead>
                <tbody className='text-center'>
                    {filteredBookings.map((booking, index) => (
                        <tr key={booking.id}>
                            <td>{index + 1}</td>
                            <td>{booking.id}</td>
                            <td>{booking.room.id}</td>
                            <td>{booking.room.roomType}</td>
                            <td>{booking.checkInDate}</td>
                            <td>{booking.checkOutDate}</td>
                            <td>{booking.guestName}</td>
                            <td>{booking.guestEmail}</td>
                            <td>{booking.numOfAdults}</td>
                            <td>{booking.numOfChildren}</td>
                            <td>{booking.totalNumOfGuest}</td>
                            <td>{booking.bookingConfirmationCode}</td>
                            <td>
                                <button
                                    className='btn btn-danger btn-sm'
                                    onClick={() => handleBookingCancellation(booking.id)}
                                >
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredBookings.length === 0 && <p className='text-danger'>No booking found for the selected dates</p>}
        </section>
    )
}

export default BookingsTable
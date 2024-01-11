import React, { useState } from 'react'
import { cancelBooking, getBookingByConfirmationCode } from '../utils/ApiFunctions'

const FindBooking = () => {
    const [confirmationCode, setConfirmationCode] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [bookingInfo, setBookingInfo] = useState({
        id: '',
        room: { id: '', roomType: '' },
        bookingConfirmationCode: '',
        roomNumber: '',
        checkInDate: '',
        checkOuDate: '',
        guestName: '',
        guestEmail: '',
        numOfAdults: '',
        numOfChildren: '',
        totalNumOfGuest: ''
    })
    const [isDeleted, setIsDeleted] = useState(false)

    const clearBookingInfor = {
        id: '',
        room: { id: '', roomType: '' },
        bookingConfirmationCode: '',
        roomNumber: '',
        checkInDate: '',
        checkOuDate: '',
        guestName: '',
        guestEmail: '',
        numOfAdults: '',
        numOfChildren: '',
        totalNumOfGuest: ''
    }

    const handleInputChange = (e) => {
        setConfirmationCode(e.target.value)
    }

    const hanleFormSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        setIsDeleted(false)
        try {
            const data = await getBookingByConfirmationCode(confirmationCode)
            setBookingInfo(data)
        } catch (error) {
            setBookingInfo(clearBookingInfor)
            setError(error.message)
        }
        setTimeout(() => {
            setIsLoading(false)
        }, 2000)
    }

    const handleBookingCancellation = async (bookingId) => {
        try {
            await cancelBooking(bookingInfo.id)
            setIsDeleted(true)
            setBookingInfo(clearBookingInfor)
            setConfirmationCode('')
            setError('')
        } catch (error) {
            setError(error.message)
        }
        setTimeout(() => {
            setIsDeleted(false)
        }, 5000)
    }

    return (
        <>
            <div className='container mt-5 d-flex flex-column justify-content-center align-items-center'>
                <h2>Find My Booking</h2>
                <form onSubmit={hanleFormSubmit} className='col-md-6'>
                    <div className='input-group mb-3'>
                        <input
                            className='form-control'
                            id='confirmationCode'
                            name='confirmationCode'
                            value={confirmationCode}
                            onChange={handleInputChange}
                            placeholder='Enter the booking confirmation code'
                        />
                        <button className='btn btn-hotel input-group-text'>Find booking</button>
                    </div>
                </form>
                {isLoading ? (<div>Finding your booking...</div>)
                    : error ? (<div className='text-danger'>{error}</div>)
                        : bookingInfo.bookingConfirmationCode ? (
                            <div className='col-md-6 mt-4 mb-5'>
                                <h3>Booking Information</h3>
                                <p>Booking Confirmation Code: {bookingInfo.bookingConfirmationCode}</p>
                                <p>Room Number: {bookingInfo.room.id}</p>
                                <p>Room Type: {bookingInfo.room.roomType}</p>
                                <p>Check In Date: {bookingInfo.checkInDate}</p>
                                <p>Check Out Date: {bookingInfo.checkOutDate}</p>
                                <p>Full Name: {bookingInfo.guestName}</p>
                                <p>Email Address: {bookingInfo.guestEmail}</p>
                                <p>Adults: {bookingInfo.numOfAdults}</p>
                                <p>Children: {bookingInfo.numOfChildren}</p>
                                <p>Total Guest: {bookingInfo.totalNumOfGuest}</p>

                                {!isDeleted && (
                                    <button
                                        className='btn btn-danger'
                                        onClick={() => handleBookingCancellation(bookingInfo.id)}
                                    >Cancel Booking
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div>
                                {isDeleted && (
                                    <div className='alert alert-success mt-3' role='alert'>Booking has been cancelled successfully!</div>
                                )}
                            </div>
                        )
                }

            </div>
        </>
    )
}

export default FindBooking
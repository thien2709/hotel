import axios from 'axios';

export const api = axios.create({
    baseURL: "http://localhost:9192/api/v1"
})

export const getHeader = () => {
    const token = localStorage.getItem("token")
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    }
}

export async function createRoom(photo, roomType, roomPrice) {
    const formData = new FormData()
    formData.append("photo", photo)
    formData.append("roomType", roomType)
    formData.append("roomPrice", roomPrice)
    const token = localStorage.getItem("token")
    const response = await api.post("/rooms/create-room", formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "image/jpeg"
            }
        })
    if (response.status === 201) {
        return true
    } else {
        return false
    }
}

export async function getRoomTypes() {
    try {
        const response = await api.get("/rooms/room-types")
        return response.data
    } catch (error) {
        throw new Error("Error fetching room types")
    }
}

export async function getAllRooms() {
    try {
        const reponse = await api.get("/rooms/all-rooms")
        return reponse.data
    } catch (error) {
        throw new Error('Error fetching rooms')
    }
}

export async function deleteRoom(roomId) {
    try {
        const result = await api.delete(`/rooms/room/delete-room/${roomId}`, {
            headers: getHeader()
        })
        return result.data
    } catch (error) {
        throw new Error(`Error deleting room ${error.message}`)
    }
}

export async function getRoomById(roomId) {
    try {
        const response = await api.get(`/rooms/room/${roomId}`)
        return response.data
    } catch (error) {
        throw new Error(`Error get room ${error.message}`)
    }
}

export async function updateRoom(roomId, photo, roomType, roomPrice) {
    const formData = new FormData()
    formData.append("photo", photo)
    formData.append("roomType", roomType)
    formData.append("roomPrice", roomPrice)
    const token = localStorage.getItem("token")

    const response = await api.put(`/rooms/update-room/${roomId}`, formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "image/jpeg"
            }
        })
    return response

}

export async function bookRoom(roomId, booking) {
    try {
        const response = await api.post(`/bookings/save-booking/${roomId}`, booking)
        return response.data
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data)
        } else {
            throw new Error(`Error booking room: ${error.message}`)
        }
    }
}

export async function getAllBookings() {
    try {
        const result = await api.get("/bookings/all")
        return result.data
    } catch (error) {
        throw new Error(`Error fetching bookings: ${error.message}`)
    }
}

export async function getBookingByConfirmationCode(confirmationCode) {
    try {
        const result = await api.get(`/bookings/find/${confirmationCode}`)
        return result.data
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data)
        } else {
            throw new Error(`Error find booking : ${error.meessage}`)
        }
    }
}

export async function cancelBooking(bookingId) {
    try {
        const result = await api.delete(`/bookings/cancel/${bookingId}`,
            {
                headers: getHeader()
            })
        return result.data
    } catch (error) {
        throw new Error(`Error cancelling booking: ${error.message}`)
    }
}

export async function getAvailableRooms(roomType, checkInDate, checkOutDate) {
    const result = await api.get(`rooms/avaiable?roomType=${roomType}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`)
    return result
}

export async function registerUser(registration) {
    try {
        const response = await api.post("/auth/register-user", registration)
        return response.data
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data)
        } else {
            throw new Error(`User registration error: ${error.message}`)
        }
    }
}

export async function loginUser(login) {
    try {
        const response = await api.post("/auth/login", login)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function getUser(userEmail, token) {
    try {
        const response = await api.get(`/users/${userEmail}`, {
            headers: getHeader()
        })
        return response.data
    } catch (error) {
        throw new Error(error.message)
    }
}

export async function deleteUser(email) {
    try {
        const response = await api.delete(`/users/delete/${email}`, {
            headers: getHeader()
        })
        return response.data
    } catch (error) {
        return error.message
    }
}

export async function getBookingsByUserId(userId, token) {
    try {
        const response = await api.get(`/bookings/user/${userId}/bookings`, {
            headers: getHeader()
        })
        return response.data
    } catch (error) {
        console.error("Error fetching bookings:", error.message)
        throw new Error("Failed to fetch bookings")
    }
}
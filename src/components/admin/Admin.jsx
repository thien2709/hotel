import React from 'react'
import { Link } from 'react-router-dom'

const Admin = () => {
    return (
        <section className='container mt-5'>
            <h2>Welcome to Admin Panel</h2>
            <hr />
            <Link to={'/rooms/existing'}>
                Manage Rooms
            </Link>
            <br />
            <Link to={'/bookings/existing'}>
                Manage Bookings
            </Link>
        </section>
    )
}

export default Admin
import React from 'react'
import MainHeader from '../layout/MainHeader'
import HotelService from '../commom/HotelService'
import Parallax from '../commom/Parallax'
import RoomCarousel from '../commom/RoomCarousel'
import RoomSearch from '../commom/RoomSearch'
import { useLocation } from 'react-router-dom'

const Home = () => {
  const location = useLocation()
  const message = location.state && location.state.message
  const currentUser = localStorage.getItem('userEmail')
  return (
    <section>
      {message && <p className='text-warning px-5 text-center'>{message}</p>}
      {currentUser && (
        <h6 className="text-success text-center"> You are logged-In as {currentUser}</h6>
      )}
      <MainHeader />
      <section className='container'>
        <RoomSearch />
        <RoomCarousel />
        <Parallax />
        <HotelService />
        <RoomCarousel />
        <Parallax />
        <RoomCarousel />
      </section>
    </section>
  )
}

export default Home
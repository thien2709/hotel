import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import Home from './components/home/Home'
import NavBar from './components/layout/NavBar'
import Footer from './components/layout/Footer'
import CreateRoom from './components/room/CreateRoom'
import ExistingRooms from './components/room/ExistingRooms'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RoomListing from './components/room/RoomListing'
import Admin from './components/admin/Admin'
import Checkout from './components/bookings/Checkout'
import BookingSuccess from './components/bookings/BookingSuccess'
import Bookings from './components/bookings/Bookings'
import FindBooking from './components/bookings/FindBooking'
import Login from './components/auth/Login'
import Registration from './components/auth/Registration'
import Profile from './components/auth/Profile'
import {  AuthProvider } from './components/auth/AuthProvider'
import RequireAuth from './components/auth/RequireAuth'

function App() {
  return (
    <AuthProvider>
      <main>
        <Router>
          <NavBar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/room/create-room' element={<CreateRoom />} />
            <Route path='/room/edit-room/:roomId' element={<CreateRoom />} />
            <Route path='/rooms/existing' element={<ExistingRooms />} />
            <Route path='/rooms/view' element={<RoomListing />} />
            <Route path='/booking-room/:roomId' element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            } />
            <Route path='/booking-success' element={<BookingSuccess />} />
            <Route path='/admin' element={<Admin />} />
            <Route path='/bookings/existing' element={<Bookings />} />
            <Route path='/find-booking' element={<FindBooking />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Registration />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/logout' element={<Profile />} />
          </Routes>
        </Router>
        <Footer />
      </main>
    </AuthProvider>
  )
}

export default App

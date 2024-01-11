import React, { useEffect, useState } from 'react'
import { deleteRoom, getAllRooms } from '../utils/ApiFunctions'
import { Col, Row } from 'react-bootstrap'
import RoomFilter from '../commom/RoomFilter'
import RoomPaginator from '../commom/RoomPaginator'
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const ExistingRooms = () => {

    const [rooms, setRooms] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [roomsPerPage] = useState(8)
    const [isLoading, setIsLoading] = useState(false)
    const [fillterdRooms, setFilterdRooms] = useState([])
    const [selectedRoomType, setSelectedRoomtype] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        fetchRooms()
    }, [])

    const fetchRooms = async () => {
        setIsLoading(true)
        try {
            const response = await getAllRooms()
            setRooms(response)
            setIsLoading(false)
        } catch (error) {
            setErrorMessage(error)
        }
    }

    useEffect(() => {
        if (selectedRoomType === "") {
            setFilterdRooms(rooms)
        } else {
            const filterd = rooms.filter((room) => room.roomType === selectedRoomType)
            setFilterdRooms(filterd)
        }
        setCurrentPage(1)
    }, [rooms, selectedRoomType])

    const calculateTotalPages = (fillterdRooms, roomsPerPage, rooms) => {
        const totalRooms = fillterdRooms.length > 0 ? fillterdRooms.length : rooms.length
        return Math.ceil(totalRooms / roomsPerPage)
    }

    const indexOfLastRoom = currentPage * roomsPerPage
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage
    const currentRooms = fillterdRooms.slice(indexOfFirstRoom, indexOfLastRoom)

    const handelPaginationClick = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const handleDeleteRoom = async (roomId) => {
        try {
            const result = await deleteRoom(roomId)
            if (result === "") {
                setSuccessMessage(`Room no ${roomId} was delete`)
                fetchRooms()
            } else {
                console.log(`Error deleting room: ${result.message}`)
            }
        } catch (error) {
            setErrorMessage(error)
        }
        setTimeout(() => {
            setSuccessMessage("")
            setErrorMessage("")
        }, 5000)
    }

    return (
        <>
            {isLoading ? (
                <p>Loading existing rooms</p>
            ) : (
                <section className='mt-5 mb-5 container'>
                    <div className='text-center text-danger'>{successMessage}</div>
                    <div className='justify-content-center mb-3 mt-5'>
                        <h2>Existing Rooms</h2>
                        <Row>
                            <Col md={6} className='mb-3 mb-md-0'>
                                <RoomFilter data={rooms}
                                    setFilterdData={setFilterdRooms}
                                />
                            </Col>
                            <Col md={6} className='d-flex justify-content-end'>
                                <Link to={"/room/create-room"} className='btn btn-outline-info ml-5'>
                                    <FaPlus />Create Room
                                </Link>
                            </Col>
                        </Row>
                        <table className='table table-bordered table-hove'>
                            <thead>
                                <tr className='text-center '>
                                    <th>ID</th>
                                    <th>Room Type</th>
                                    <th>Room Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRooms.map((room) => (
                                    <tr key={room.id} className='text-center'>
                                        <td>{room.id}</td>
                                        <td>{room.roomType}</td>
                                        <td>{room.roomPrice}</td>
                                        <td className='gap-2'>
                                            <Link to={`/room/edit-room/${room.id}`}>
                                                <span className='btn btn-info'>
                                                    <FaEye />
                                                </span>
                                                <span className='btn btn-warning'>
                                                    <FaEdit />
                                                </span>
                                            </Link>
                                            <button
                                                className='btn btn-danger btn-sm'
                                                onClick={() => handleDeleteRoom(room.id)}
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <RoomPaginator currentPage={currentPage}
                            totalPage={calculateTotalPages(fillterdRooms, roomsPerPage, rooms)}
                            onPageChange={handelPaginationClick}
                        />
                    </div>
                </section>
            )}
        </>
    )
}

export default ExistingRooms
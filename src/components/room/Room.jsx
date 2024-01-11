import React, { useEffect, useState } from 'react'
import { getAllRooms } from '../utils/ApiFunctions'
import RoomCard from './RoomCard'
import { Col, Container, Row } from 'react-bootstrap'
import RoomFilter from '../commom/RoomFilter'
import RoomPaginator from '../commom/RoomPaginator'

const Room = () => {
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [roomsPerPage] = useState(6)
    const [filterdData, setFilteredData] = useState([])

    useEffect(() => {
        setIsLoading(true)
        getAllRooms().then((data) => {
            setData(data)
            setFilteredData(data)
            setIsLoading(false)
        }).catch((error) => {
            setError(error.message)
        })
    }, [])

    if (isLoading) {
        return <div>Loading Rooms...</div>
    }

    if (error) {
        return <div className='text-danger'>Error : {error}</div>
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const totalPages = Math.ceil(filterdData.length / roomsPerPage)

    const renderRooms = () => {
        const startIndex = (currentPage - 1) * roomsPerPage
        const lastIndex = startIndex + roomsPerPage
        return filterdData.slice(startIndex, lastIndex).map((room) => <RoomCard key={room.id} room={room} />)
    }

    return (
        <Container>
            <Row>
                <Col md={6} className='mb-3 mb mb-md-0'>
                    <RoomFilter data={data}
                        setFilterdData={setFilteredData}
                    />
                </Col>
                <Col md={6} className='d-flex align-items-center justify-content-end'>
                    <RoomPaginator currentPage={currentPage}
                        onPageChange={handlePageChange}
                        totalPage={totalPages}
                    />
                </Col>
            </Row>
            <Row>
                {renderRooms()}
            </Row>
            <Row>
                <Col md={6} className='d-flex align-items-center justify-content-end'>
                    <RoomPaginator currentPage={currentPage}
                        onPageChange={handlePageChange}
                        totalPage={totalPages}
                    />
                </Col>
            </Row>
        </Container>
    )
}

export default Room
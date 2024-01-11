import moment from 'moment'
import React, { useState } from 'react'
import { getAvailableRooms } from '../utils/ApiFunctions'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import RoomTypeSelector from './RoomTypeSelector'
import RoomSearchResults from './RoomSearchResults'

const RoomSearch = () => {
    const [searchForm, setSearchForm] = useState({
        roomType: '',
        checkInDate: '',
        checkOutDate: ''
    })
    const [errorMessage, setErrorMessage] = useState('')
    const [availableRooms, setAvaiableRooms] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleSearch = (e) => {
        e.preventDefault()
        const checkIn = moment(searchForm.checkInDate)
        const checkOut = moment(searchForm.checkOutDate)
        if (!checkIn.isValid() || !checkOut.isValid) {
            setErrorMessage('Please, enter valid date range')
            return
        }
        if (!checkOut.isSameOrAfter(checkIn)) {
            setErrorMessage('Check-In date must come before check-out date')
            return
        }
        localStorage.setItem("checkIn",searchForm.checkInDate)
        localStorage.setItem("checkOut",searchForm.checkOutDate)
        setIsLoading(true)
        getAvailableRooms(searchForm.roomType, searchForm.checkInDate, searchForm.checkOutDate).then((response) => {
            setAvaiableRooms(response.data)
            setTimeout(() => {
                setIsLoading(false)
            }, 3000)
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setSearchForm({ ...searchForm, [name]: value })

        const checkIn = moment(searchForm.checkInDate)
        const checkOut = moment(searchForm.checkOutDate)
        if (checkIn.isValid() && checkOut.isValid()) {
            setErrorMessage('')
        }

    }

    const clearSearch = () => {
        setSearchForm({
            roomType: '',
            checkInDate: '',
            checkOutDate: ''
        })
        setAvaiableRooms([])
    }

    return (
        <>
            <Container className='mt-5 mb-5 py-5 shadow'>
                <Form onSubmit={handleSearch}>
                    <Row className='justify-content-center '>
                        <Col xs={12} md={3}>
                            <Form.Group controlId='checkInDate'>
                                <Form.Label >
                                    Check-in date
                                </Form.Label>
                                <Form.Control
                                    type='date'
                                    name='checkInDate'
                                    value={searchForm.checkInDate}
                                    onChange={handleInputChange}
                                    min={moment().format('YYYY--MM-DD')}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={3}>
                            <Form.Group controlId='checkOutDate'>
                                <Form.Label >
                                    Check-out date
                                </Form.Label>
                                <Form.Control
                                    type='date'
                                    name='checkOutDate'
                                    value={searchForm.checkOutDate}
                                    onChange={handleInputChange}
                                    min={moment().format('YYYY--MM-DD')}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={3}>
                            <Form.Group controlId='roomType'>
                                <Form.Label >
                                    Room Type
                                </Form.Label>
                                <div className='d-flex'>
                                    <RoomTypeSelector handelRoomInputChange={handleInputChange}
                                        room={searchForm}
                                    />
                                    <Button variant='secondary' type='submit'>Search</Button>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
                {isLoading ? (
                    <p>Finding avaiable rooms ...</p>
                ) : availableRooms ? (
                    <RoomSearchResults result={availableRooms}
                        onClearSearch={clearSearch}
                    />
                ) : <p>No rooms avaiable for the selected dates and room type</p>}
                {errorMessage && <p className='text-danger text-center'>{errorMessage}</p>}
            </Container>
        </>
    )
}

export default RoomSearch
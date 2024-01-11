import React, { useEffect, useState } from 'react'
import { createRoom, getRoomById, updateRoom } from '../utils/ApiFunctions'
import RoomTypeSelector from '../commom/RoomTypeSelector'
import { Link, useParams } from 'react-router-dom'

const CreateRoom = () => {
    const [room, setRoom] = useState({
        photo: null,
        roomType: "",
        roomPrice: ""
    })

    const [imagePreview, setImagePreview] = useState("")
    const [successMessage, setSuccessMessagee] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const { roomId } = useParams()

    if (roomId !== undefined) {
        useEffect(() => {
            const roomData = getRoomById(roomId)
            roomData.then(response => {
                const theRoom = response
                setRoom(theRoom)
                setImagePreview(theRoom.photo)
            })
        }, [roomId])
    }

    const handelRoomInputChange = (e) => {
        const name = e.target.name
        let value = e.target.value
        if (name === "roomPrice") {
            if (value < 0) {
                value = 0
            }
            if (!isNaN(value)) {
                Number(value)
            } else {
                value = ""
            }
        }
        setRoom({ ...room, [name]: value })
    }

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0]
        setRoom({ ...room, photo: selectedImage })
        const src = URL.createObjectURL(selectedImage)
        if (roomId !== undefined) {
            setImagePreview("")
        } else {
            setImagePreview(src)
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (roomId) {
            try {
                const roomData = updateRoom(roomId, room.photo, room.roomType, room.roomPrice)
                roomData.then(response => {
                    if (response !== null) {
                        const theRoom = response.data
                        setRoom(theRoom)
                        setImagePreview(theRoom.photo)
                        setSuccessMessagee("Update room success!")
                        setErrorMessage("")
                    } else {
                        setErrorMessage('Error updating room')
                    }
                })
            } catch (error) {
                setErrorMessage(error.message)
            }
        } else {
            try {
                const success = await createRoom(room.photo, room.roomType, room.roomPrice)
                if (success !== undefined) {
                    setSuccessMessagee("Create room success!")
                    setRoom({ photo: null, roomType: "", roomPrice: "" })
                    setImagePreview("")
                    setErrorMessage("")
                } else {
                    setErrorMessage("Create room error!")
                }
            } catch (error) {
                setErrorMessage(error.message)
            }
        }
        setTimeout(() => {
            setSuccessMessagee("")
            setErrorMessage("")
        }, 5000)
    }

    return (
        <>
            <section className='container mt-5 mb-5'>
                <div className='row justify-content-center'>
                    <div className='col-md-8 col-lg-6'>
                        <h2 className='mt-5 mb-2'>
                            {roomId === undefined ? 'Create Room' : 'Update Room'}
                        </h2>
                        {successMessage && (
                            <div className='alert alert-success fade show'>{successMessage}</div>
                        )}
                        {errorMessage && (
                            <div className='alert alert-danger fade show'>{errorMessage}</div>
                        )}
                        <form onSubmit={handleSubmit} enctype="multipart/form-data">
                            <div className='mb-3 text-start'>
                                <label htmlFor='roomType' className='form-label'>
                                    Room Type
                                </label>
                                <div>
                                    <RoomTypeSelector
                                        handelRoomInputChange={handelRoomInputChange}
                                        room={room}
                                    />
                                </div>
                            </div>
                            <div className='mb-3 text-start'>
                                <label htmlFor='roomPrice' className='form-label'>
                                    Room Price
                                </label>
                                <input className='form-control'
                                    id='roomPrice'
                                    name='roomPrice'
                                    type='number'
                                    value={room.roomPrice}
                                    onChange={handelRoomInputChange}
                                />
                            </div>
                            <div className='mb-3 text-start'>
                                <label htmlFor='photo' className='form-label'>
                                    Room Photo
                                </label>
                                <input
                                    className='form-control'
                                    id='photo'
                                    name='photo'
                                    type='file'
                                    onChange={handleImageChange}
                                />
                                {imagePreview && (
                                    roomId !== undefined ?
                                        <img
                                            src={`data:image/png;base64, ${imagePreview}`}
                                            alt='Preview Room Photo'
                                            style={{ maxWidth: "400px", maxHeight: "400px" }}
                                            className='mb-3'
                                        />
                                        :
                                        <img
                                            src={imagePreview}
                                            alt='Preview Room Photo'
                                            style={{ maxWidth: "400px", maxHeight: "400px" }}
                                            className='mb-3'
                                        />
                                )}
                            </div>
                            <div className='d-grid d-md-flex mt-2'>
                                <Link to={"/rooms/existing"} className='btn btn-outline-info ml-5'>
                                    Back
                                </Link>
                                <button className='btn btn-outline-primary ml-5' onClick={handleSubmit}>
                                    {roomId === undefined ? 'Create Room' : 'Update Room'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default CreateRoom
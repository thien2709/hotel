import React, { useEffect, useState } from 'react'
import { getRoomTypes } from '../utils/ApiFunctions'
import { useAuth } from '../auth/AuthProvider'

const RoomTypeSelector = ({ handelRoomInputChange, room }) => {
    const [roomTypes, setRoomTypes] = useState([])
    const [showNewRoomTypeInput, setShowNewRoomTypeInput] = useState(false)
    const [newRoomType, setNewRoomType] = useState("")

    useEffect(() => {
        getRoomTypes().then((data) => {
            setRoomTypes(data)
        })
    }, [])

    const handelNewRoomTypeInputChange = (e) => {
        setNewRoomType(e.target.value)
    }

    const handelAddNewRoomType = () => {
        if (newRoomType !== "") {
            setRoomTypes([...roomTypes, newRoomType])
            setNewRoomType("")
            setShowNewRoomTypeInput(false)
        }
    }

    const user  = localStorage.getItem('userEmail')
    const isLoggedIn = user !== null
    const userRole = localStorage.getItem('userRoles')

    return (
        <>
            {roomTypes.length >= 0 && (
                <div>
                    <select
                        className='form-control'
                        id='roomType'
                        name='roomType'
                        value={room.roomType}
                        onChange={(e) => {
                            if (e.target.value === "Add New") {
                                setShowNewRoomTypeInput(true)
                            } else {
                                handelRoomInputChange(e)
                            }
                        }}
                    >
                        <option value={""}>Select a room type</option>
                        {isLoggedIn && userRole.includes('ROLE_ADMIN') &&  <option value={"Add New"}>Add New</option>}
                        {roomTypes.map((type, index) => (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    {showNewRoomTypeInput && (
                        <div className='input-group'>
                            <input
                                className='form-control'
                                type='text'
                                placeholder='Enter a new room type'
                                onChange={handelNewRoomTypeInputChange}
                            />
                            <button className='btn btn-hotel' type='button' onClick={handelAddNewRoomType}>
                                Add
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default RoomTypeSelector
import React, { useState } from 'react'

const RoomFilter = ({ data, setFilterdData }) => {

    const [filter, setFilter] = useState("")

    const handelSelectChange = (e) => {
        const selectedRoomType = e.target.value
        setFilter(selectedRoomType)
        const filteredRooms = data.filter((room) =>
            room.roomType.toLowerCase().includes(selectedRoomType.toLowerCase()))
        setFilterdData(filteredRooms)
    }
    const clearFilter = () => {
        setFilter("")
        setFilterdData(data)
    }
    const roomTypes = ["", ... new Set(data.map((room) => room.roomType))]

    return (
        <div className='input-group mb-3'>
            <span className='input-group-text' id='room-type-filter'>
                Filter rooms by type
            </span>
            <select
                className='form-select'
                value={filter}
                onChange={handelSelectChange}
            >
                <option value={""}>Select a room type to filter...</option>
                {roomTypes.map((type, index) => (
                    <option key={index} value={type}>
                        {type}
                    </option>
                ))}
            </select>
            <button className='btn btn-hotel' type='button' onClick={clearFilter}>Clear filter</button>
        </div>
    )
}

export default RoomFilter
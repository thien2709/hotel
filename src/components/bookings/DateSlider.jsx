import React, { useState } from 'react'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { DateRangePicker } from 'react-date-range'

const DateSlider = ({ onDateChange, onFilterChange }) => {
    const [dateRanger, setDateRanger] = useState({
        startDate: undefined,
        endDate: undefined,
        key: 'selection'
    })

    const handleSelect = (ranges) => {
        setDateRanger(ranges.selection)
        onDateChange(ranges.selection.startDate, ranges.selection.endDate)
        onFilterChange(ranges.selection.startDate, ranges.selection.endDate)
    }

    const handleClearFilter = () => {
        setDateRanger({
            startDate: undefined,
            endDate: undefined,
            key: 'selection'
        })
        onDateChange(null, null)
        onFilterChange(null, null)
    }

    return (
        <>
            <h5>Filter bookings by date</h5>
            <DateRangePicker ranges={[dateRanger]} onChange={handleSelect} className='mb-4' />
            <button className='btn btn-secondary' onClick={handleClearFilter}>
                Clear Filter
            </button>
        </>
    )
}

export default DateSlider
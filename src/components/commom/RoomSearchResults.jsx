import React, { useState } from 'react'
import { Button, Row } from 'react-bootstrap'
import RoomCard from '../room/RoomCard'
import RoomPaginator from './RoomPaginator'

const RoomSearchResults = ({ result, onClearSearch }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const resultPerPage = 3
    const totalResult = result.length
    const totalPages = Math.ceil(totalResult / resultPerPage)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const startIndex = (currentPage - 1) * resultPerPage
    const endIndex = startIndex + resultPerPage
    const paginationedResult = result.slice(startIndex, endIndex)

    return (
        <>
            {result.length > 0 ? (
                <>
                    <h5 className='text-center mt-5'>Search Result</h5>
                    <Row>
                        {paginationedResult.map((room) => (
                            <RoomCard key={room.id}
                                room={room} />
                        ))}
                    </Row>
                    <Row>
                        {totalResult > resultPerPage && (
                            <RoomPaginator currentPage={currentPage}
                                totalPage={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </Row>
                    <Button
                        variant='secondary'
                        onClick={onClearSearch}
                    >
                        Clear Search
                    </Button>
                </>
            ) : <p></p>}
        </>
    )
}

export default RoomSearchResults
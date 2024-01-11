import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';

const Footer = () => {
    let year = new Date().getFullYear();
    return (
        <footer className='by-dark py-3 footer'>
            <Container>
                <Row>
                    <Col xs={12} md={12} className='text-center'>
                        <p className='text-light'>&copy; {year} Mini Hotel</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer
import React from 'react'

const Header = ({ tiltle }) => {
    return (
        <header className='header'>
            <div className='overlay'></div>
            <div className='container'>
                <h1 className='header-title text-center'>{tiltle}</h1>
            </div>
        </header>
    )
}

export default Header
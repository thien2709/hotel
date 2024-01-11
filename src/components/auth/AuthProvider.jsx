import { jwtDecode } from 'jwt-decode'
import React, { createContext, useContext, useState } from 'react'

export const AuthContext = createContext({
    user: null,
    handleLogin: () => { },
    handleLogout: () => { }
})

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    const handleLogin = (token) => {
        const decodedToken = jwtDecode(token)
        localStorage.setItem('userEmail', decodedToken.sub)
        localStorage.setItem('userRoles', decodedToken.roles)
        localStorage.setItem('token', token)
        setUser(decodedToken)
    }

    const handleLogout = () => {
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userRoles')
        localStorage.removeItem('token')
        localStorage.removeItem('checkIn')
        localStorage.removeItem('checkOut')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
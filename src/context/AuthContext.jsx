import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check localStorage for existing session
        const storedUser = localStorage.getItem('summitUser')
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (e) {
                localStorage.removeItem('summitUser')
            }
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        try {
            // Call the backend API
            const response = await api.post('/auth/login', { email, password })

            const userData = response.data
            setUser(userData)
            localStorage.setItem('summitUser', JSON.stringify(userData))
            return { success: true, user: userData }
        } catch (error) {
            // Return error from backend or fallback message
            const errorMessage = error.response?.data?.error || 'Invalid email or password'
            return { success: false, error: errorMessage }
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('summitUser')
    }

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext

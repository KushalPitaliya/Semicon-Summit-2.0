import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

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
        // Check for stored user on mount
        const storedUser = localStorage.getItem('summitUser')
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser)
                // Validate token with backend
                const token = parsedUser.token || parsedUser._id
                authAPI.validateToken(token)
                    .then(validatedUser => {
                        // Preserve the token from stored data
                        validatedUser.token = parsedUser.token || parsedUser._id
                        setUser(validatedUser)
                    })
                    .catch(() => {
                        localStorage.removeItem('summitUser')
                        setUser(null)
                    })
                    .finally(() => setLoading(false))
            } catch {
                localStorage.removeItem('summitUser')
                setLoading(false)
            }
        } else {
            setLoading(false)
        }
    }, [])

    const login = async (email, password) => {
        const userData = await authAPI.login(email, password)
        // userData now includes a JWT token from the backend
        localStorage.setItem('summitUser', JSON.stringify(userData))
        setUser(userData)
        return userData
    }

    const logout = () => {
        localStorage.removeItem('summitUser')
        setUser(null)
    }

    const value = {
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext

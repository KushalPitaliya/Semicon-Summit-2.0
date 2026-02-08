import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading, isAuthenticated } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
                <style>{`
          .loading-screen {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            background: var(--bg-primary);
          }
          .loading-spinner {
            width: 48px;
            height: 48px;
            border: 3px solid var(--border-default);
            border-top-color: var(--primary-500);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        const dashboardRoutes = {
            participant: '/dashboard/participant',
            coordinator: '/dashboard/coordinator',
            faculty: '/dashboard/faculty'
        }
        return <Navigate to={dashboardRoutes[user.role] || '/'} replace />
    }

    return children
}

export default ProtectedRoute

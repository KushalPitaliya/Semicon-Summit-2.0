import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ParticipantDashboard from './pages/ParticipantDashboard'
import CoordinatorDashboard from './pages/CoordinatorDashboard'
import FacultyDashboard from './pages/FacultyDashboard'
import { useCircuitRipple } from './hooks/useSemiconductorEffects'

function App() {
  // Enable semiconductor-themed click ripples
  useCircuitRipple();

  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard/participant"
          element={
            <ProtectedRoute allowedRoles={['participant']}>
              <ParticipantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/coordinator"
          element={
            <ProtectedRoute allowedRoles={['coordinator']}>
              <CoordinatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/faculty"
          element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App


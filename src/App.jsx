import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Events from './pages/Events'
import About from './pages/About'
import Contact from './pages/Contact'
import Committee from './pages/Committee'
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
        <Route path="/events" element={<Events />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/committee" element={<Committee />} />

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


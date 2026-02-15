import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Cpu, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import ParticleField from '../components/ParticleField'
import './Login.css'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const [showForgotModal, setShowForgotModal] = useState(false)
    const [forgotEmail, setForgotEmail] = useState('')
    const [forgotStatus, setForgotStatus] = useState({ loading: false, success: false, error: '' })

    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (!email || !password) {
            setError('Please enter both email and password')
            setLoading(false)
            return
        }

        try {
            const result = await login(email, password)

            if (result.success) {
                // Redirect based on role
                const dashboardRoutes = {
                    participant: '/dashboard/participant',
                    coordinator: '/dashboard/coordinator',
                    faculty: '/dashboard/faculty'
                }
                const redirectTo = dashboardRoutes[result.user.role] || '/'
                navigate(redirectTo, { replace: true })
            } else {
                setError(result.error || 'Invalid credentials')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        }

        setLoading(false)
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        setForgotStatus({ loading: true, success: false, error: '' })

        try {
            // Use the api service instead of raw fetch
            await api.post('/auth/forgot-password', { email: forgotEmail })
            setForgotStatus({ loading: false, success: true, error: '' })
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to request password reset'
            setForgotStatus({ loading: false, success: false, error: errorMessage })
        }
    }

    return (
        <div className="login-page">
            <div className="login-bg">
                <div className="login-grid"></div>
                <div className="login-glow login-glow-1"></div>
                <div className="login-glow login-glow-2"></div>
                <ParticleField count={40} />
            </div>

            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <Link to="/" className="login-logo">
                            <img 
                                src="/images/Logo/Logo of SS.png" 
                                alt="Semiconductor Summit 2.0" 
                                className="login-logo-img"
                            />
                        </Link>
                        <h1>Welcome Back</h1>
                        <p>Enter your credentials to access your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="login-error">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    className="input"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="label-row">
                                <label htmlFor="password">Password</label>
                                <button
                                    type="button"
                                    className="forgot-password-link"
                                    onClick={() => setShowForgotModal(true)}
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    className="input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg login-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loading-spinner-small"></span>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register">
                                Register Now
                            </Link>
                        </p>

                        <Link to="/" className="back-to-home">
                            ← Back to Home
                        </Link>
                    </div>


                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="modal-overlay">
                    <div className="modal-content forgot-password-modal">
                        <button
                            className="modal-close"
                            onClick={() => {
                                setShowForgotModal(false)
                                setForgotStatus({ loading: false, success: false, error: '' })
                                setForgotEmail('')
                            }}
                        >
                            &times;
                        </button>

                        <div className="modal-header">
                            <div className="modal-icon-wrapper">
                                <Lock size={24} />
                            </div>
                            <h2>Reset Password</h2>
                            <p>Enter your email address and we'll send you a new password.</p>
                        </div>

                        {forgotStatus.success ? (
                            <div className="forgot-success">
                                <CheckCircle size={48} className="success-icon" />
                                <h3>Email Sent!</h3>
                                <p>Please check your inbox for your new temporary password.</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setShowForgotModal(false)
                                        setForgotStatus({ loading: false, success: false, error: '' })
                                        setForgotEmail('')
                                    }}
                                >
                                    Back to Login
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleForgotPassword}>
                                {forgotStatus.error && (
                                    <div className="login-error">
                                        <AlertCircle size={18} />
                                        <span>{forgotStatus.error}</span>
                                    </div>
                                )}

                                <div className="input-group">
                                    <label htmlFor="forgot-email">Email Address</label>
                                    <div className="input-wrapper">
                                        <Mail size={18} className="input-icon" />
                                        <input
                                            type="email"
                                            id="forgot-email"
                                            className="input"
                                            placeholder="Enter your registered email"
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={forgotStatus.loading}
                                >
                                    {forgotStatus.loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Login

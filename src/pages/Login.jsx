import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Cpu, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Login.css'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

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

    return (
        <div className="login-page">
            <div className="login-bg">
                <div className="login-grid"></div>
                <div className="login-glow login-glow-1"></div>
                <div className="login-glow login-glow-2"></div>
            </div>

            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <Link to="/" className="login-logo">
                            <div className="logo-icon">
                                <Cpu size={28} />
                            </div>
                            <div className="logo-text">
                                <span className="logo-title">Semiconductor</span>
                                <span className="logo-subtitle">Summit 2.0</span>
                            </div>
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
                            <label htmlFor="password">Password</label>
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

                    <div className="demo-credentials">
                        <p className="demo-title">Demo Credentials</p>
                        <div className="demo-list">
                            <div className="demo-item">
                                <span className="demo-role">Participant:</span>
                                <code>participant@demo.com</code>
                            </div>
                            <div className="demo-item">
                                <span className="demo-role">Coordinator:</span>
                                <code>coordinator@demo.com</code>
                            </div>
                            <div className="demo-item">
                                <span className="demo-role">Faculty:</span>
                                <code>faculty@demo.com</code>
                            </div>
                            <div className="demo-item">
                                <span className="demo-role">Password:</span>
                                <code>demo123</code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login

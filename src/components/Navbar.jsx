import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Cpu } from 'lucide-react'
import './Navbar.css'

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: 'Home', path: '/', isRoute: true },
        { name: 'Events', path: '/events', isRoute: true },
        { name: 'About', path: '/about', isRoute: true },
        { name: 'Contact', path: '/contact', isRoute: true },
    ]

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon">
                        <Cpu size={28} />
                    </div>
                    <div className="logo-text">
                        <span className="logo-title">Semiconductor</span>
                        <span className="logo-subtitle">Summit 2.0</span>
                    </div>
                </Link>

                <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="nav-link"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link to="/login" className="btn btn-primary btn-sm nav-login-btn">
                        Login
                    </Link>
                </div>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    )
}

export default Navbar

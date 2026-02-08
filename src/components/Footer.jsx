import { Link } from 'react-router-dom'
import { Cpu, Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from 'lucide-react'
import './Footer.css'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    const quickLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Events', href: '#events' },
        { name: 'Register', href: '#register' },
        { name: 'Contact', href: '#contact' },
    ]

    const socialLinks = [
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Instagram, href: '#', label: 'Instagram' },
    ]

    return (
        <footer className="footer">
            <div className="footer-glow"></div>
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <div className="logo-icon">
                                <Cpu size={24} />
                            </div>
                            <div className="logo-text">
                                <span className="logo-title">Semiconductor</span>
                                <span className="logo-subtitle">Summit 2.0</span>
                            </div>
                        </Link>
                        <p className="footer-description">
                            Join us for the premier semiconductor technology conference featuring
                            workshops, hackathons, and expert talks from industry leaders.
                        </p>
                        <div className="social-links">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="social-link"
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul className="footer-links">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href}>{link.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Contact Us</h4>
                        <ul className="footer-contact">
                            <li>
                                <Mail size={18} />
                                <span>contact@semiconsummit.com</span>
                            </li>
                            <li>
                                <Phone size={18} />
                                <span>+91 98765 43210</span>
                            </li>
                            <li>
                                <MapPin size={18} />
                                <span>Your College Name, City, State</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} Semiconductor Summit 2.0. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer

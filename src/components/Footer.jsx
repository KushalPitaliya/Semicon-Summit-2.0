import { Link } from 'react-router-dom'
import { Cpu, Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Youtube, Facebook } from 'lucide-react'
import './Footer.css'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Events', path: '/events' },
        { name: 'Committee', path: '/committee' },
        { name: 'Register', path: '/register' },
        { name: 'Contact', path: '/contact' },
    ]

    const socialLinks = [
        { icon: Youtube, href: 'https://www.youtube.com/@CHARUSATUniversityOfficial', label: 'YouTube' },
        { icon: Facebook, href: 'https://www.facebook.com/thecharusat/', label: 'Facebook' },
        { icon: Twitter, href: 'https://x.com/thecharusat/', label: 'X (Twitter)' },
        { icon: Instagram, href: 'https://www.instagram.com/thecharusat/', label: 'Instagram' },
        { icon: Linkedin, href: 'https://www.linkedin.com/school/charotar-university-of-science-and-technology/', label: 'LinkedIn' },
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
                                    target="_blank"
                                    rel="noopener noreferrer"
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
                                    {link.path.startsWith('/#') ? (
                                        <a href={link.path}>{link.name}</a>
                                    ) : (
                                        <Link to={link.path}>{link.name}</Link>
                                    )}
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
                                <span>semisummit.ec@charusat.ac.in</span>
                            </li>
                            <li>
                                <Phone size={18} />
                                <span>+91 98765 43210</span>
                            </li>
                            <li>
                                <MapPin size={18} />
                                <span>CHARUSAT University, Changa, Gujarat</span>
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

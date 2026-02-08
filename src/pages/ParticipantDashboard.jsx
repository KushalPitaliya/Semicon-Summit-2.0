import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    User, Calendar, Bell, Image, LogOut,
    ChevronRight, ExternalLink
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

const ParticipantDashboard = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [announcements, setAnnouncements] = useState([])
    const [photos, setPhotos] = useState([])

    useEffect(() => {
        // Fetch announcements and photos from backend
        // For now, using mock data
        setAnnouncements([
            { id: 1, title: 'Welcome to Semiconductor Summit 2.0!', date: '2026-02-01', content: 'We are excited to have you join us.' },
            { id: 2, title: 'Schedule Released', date: '2026-02-03', content: 'Check out the full event schedule on our website.' },
        ])
        setPhotos([
            { id: 1, url: '/assets/event1.jpg', caption: 'Last year highlights' },
            { id: 2, url: '/assets/event2.jpg', caption: 'Workshop session' },
        ])
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/', { replace: true })
    }

    return (
        <div className="dashboard-page">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="logo-icon-small">SS</div>
                        <span>Summit 2.0</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <a href="#profile" className="nav-item active">
                        <User size={20} />
                        <span>Profile</span>
                    </a>
                    <a href="#events" className="nav-item">
                        <Calendar size={20} />
                        <span>My Events</span>
                    </a>
                    <a href="#announcements" className="nav-item">
                        <Bell size={20} />
                        <span>Announcements</span>
                    </a>
                    <a href="#gallery" className="nav-item">
                        <Image size={20} />
                        <span>Gallery</span>
                    </a>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <h1>Welcome, {user?.name || 'Participant'}!</h1>
                        <p>Your participant dashboard</p>
                    </div>
                    <div className="header-actions">
                        <span className="badge badge-success">Registered</span>
                    </div>
                </header>

                <div className="dashboard-content">
                    {/* Profile Section */}
                    <section id="profile" className="dashboard-section">
                        <div className="section-header-row">
                            <h2>Your Profile</h2>
                        </div>
                        <div className="profile-card card">
                            <div className="profile-avatar">
                                <User size={32} />
                            </div>
                            <div className="profile-info">
                                <div className="profile-row">
                                    <span className="profile-label">Name</span>
                                    <span className="profile-value">{user?.name || 'John Doe'}</span>
                                </div>
                                <div className="profile-row">
                                    <span className="profile-label">Email</span>
                                    <span className="profile-value">{user?.email || 'user@example.com'}</span>
                                </div>
                                <div className="profile-row">
                                    <span className="profile-label">College</span>
                                    <span className="profile-value">{user?.college || 'Tech University'}</span>
                                </div>
                                <div className="profile-row">
                                    <span className="profile-label">Phone</span>
                                    <span className="profile-value">{user?.phone || '+91 98765 43210'}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Events Section */}
                    <section id="events" className="dashboard-section">
                        <div className="section-header-row">
                            <h2>Registered Events</h2>
                        </div>
                        <div className="events-list">
                            {(user?.events || ['VLSI Design Workshop', 'Chip Architecture Talk']).map((event, index) => (
                                <div key={index} className="event-item card">
                                    <div className="event-item-icon">
                                        <Calendar size={20} />
                                    </div>
                                    <div className="event-item-info">
                                        <h4>{event}</h4>
                                        <p>Scheduled time will be announced soon</p>
                                    </div>
                                    <ChevronRight size={20} className="event-item-arrow" />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Announcements Section */}
                    <section id="announcements" className="dashboard-section">
                        <div className="section-header-row">
                            <h2>Announcements</h2>
                        </div>
                        <div className="announcements-list">
                            {announcements.length === 0 ? (
                                <div className="empty-state">
                                    <Bell size={32} />
                                    <p>No announcements yet</p>
                                </div>
                            ) : (
                                announcements.map((announcement) => (
                                    <div key={announcement.id} className="announcement-item card">
                                        <div className="announcement-header">
                                            <h4>{announcement.title}</h4>
                                            <span className="announcement-date">{announcement.date}</span>
                                        </div>
                                        <p>{announcement.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Gallery Section */}
                    <section id="gallery" className="dashboard-section">
                        <div className="section-header-row">
                            <h2>Photo Gallery</h2>
                        </div>
                        <div className="gallery-grid">
                            {photos.length === 0 ? (
                                <div className="empty-state">
                                    <Image size={32} />
                                    <p>No photos uploaded yet</p>
                                </div>
                            ) : (
                                photos.map((photo) => (
                                    <div key={photo.id} className="gallery-item card">
                                        <div className="gallery-placeholder">
                                            <Image size={32} />
                                            <span>{photo.caption}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default ParticipantDashboard

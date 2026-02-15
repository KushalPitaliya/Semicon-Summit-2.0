import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Users, Download, Filter, Search, LogOut, Image,
    AlertTriangle, X, Key, Trash2, UserCog, Upload, ImagePlus, Bell
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import * as XLSX from 'xlsx'
import './Dashboard.css'


const FacultyDashboard = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('registrations')
    const [participants, setParticipants] = useState([])
    const [filteredParticipants, setFilteredParticipants] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedEvent, setSelectedEvent] = useState('all')
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(null)


    // User Management State
    const [allUsers, setAllUsers] = useState([])
    const [userManagementModal, setUserManagementModal] = useState({ open: false, user: null, action: null })
    const [deleteConfirmModal, setDeleteConfirmModal] = useState({ open: false, user: null })

    // Gallery State
    const [galleryImages, setGalleryImages] = useState([])
    const [galleryUploadModal, setGalleryUploadModal] = useState(false)
    const [galleryForm, setGalleryForm] = useState({ title: '', description: '', category: 'event', files: [] })

    // Announcements State
    const [announcements, setAnnouncements] = useState([])
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' })

    const events = [
        'All Events',
        'VLSI Design Workshop',
        'Chip Architecture Talk',
        'Embedded Systems Hackathon',
        'Industry Panel Discussion'
    ]

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            // Fetch all verified participants
            const participantsRes = await api.get('/participants')
            setParticipants(participantsRes.data)
            setFilteredParticipants(participantsRes.data)

            // Fetch all users for user management
            const usersRes = await api.get('/users')
            setAllUsers(usersRes.data)




            // Fetch announcements
            const annRes = await api.get('/announcements')
            setAnnouncements(annRes.data)

            // Fetch gallery images
            const galleryRes = await api.get('/gallery')
            setGalleryImages(galleryRes.data)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let filtered = participants

        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.college?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (selectedEvent !== 'all') {
            filtered = filtered.filter(p =>
                p.events?.includes(selectedEvent)
            )
        }

        setFilteredParticipants(filtered)
    }, [searchTerm, selectedEvent, participants])

    const handleLogout = () => {
        logout()
        navigate('/', { replace: true })
    }



    const handleAddAnnouncement = async () => {
        if (!newAnnouncement.title || !newAnnouncement.content) return

        setActionLoading('announcement')
        try {
            await api.post('/announcements', {
                ...newAnnouncement,
                role: 'faculty',
                postedBy: user._id
            })
            setNewAnnouncement({ title: '', content: '' })
            // Refresh
            const annRes = await api.get('/announcements')
            setAnnouncements(annRes.data)
        } catch (error) {
            console.error('Error creating announcement:', error)
            alert('Failed to create announcement')
        } finally {
            setActionLoading(null)
        }
    }

    const handleDeleteAnnouncement = async (id) => {
        if (!window.confirm('Delete this announcement?')) return
        try {
            await api.delete(`/announcements/${id}`)
            // Refresh
            const annRes = await api.get('/announcements')
            setAnnouncements(annRes.data)
        } catch (error) {
            console.error('Error deleting announcement:', error)
            alert('Failed to delete announcement')
        }
    }



    const handleExport = () => {
        // Prepare data for Excel
        const excelData = filteredParticipants.map((p, index) => ({
            'S.No': index + 1,
            'Name': p.name || '',
            'Email': p.email || '',
            'Password': p.generatedPassword || 'N/A',
            'Phone': p.phone || '',
            'College': p.college || '',
            'Selected Events': (p.selectedEvents || []).join(', '),
            'Transaction ID': p.transactionId || p.paymentRef || '',
            'Amount Paid': p.paymentAmount || 400,
            'Status': p.verificationStatus || 'approved',
            'Registered On': p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : p.timestamp || ''
        }))

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData)

        // Set column widths
        worksheet['!cols'] = [
            { wch: 6 },   // S.No
            { wch: 25 },  // Name
            { wch: 30 },  // Email
            { wch: 12 },  // Password
            { wch: 15 },  // Phone
            { wch: 30 },  // College
            { wch: 40 },  // Events
            { wch: 20 },  // Transaction ID
            { wch: 12 },  // Amount
            { wch: 12 },  // Status
            { wch: 15 },  // Date
        ]

        // Create workbook
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations')

        // Generate filename with date
        const filename = `Summit_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`

        // Download file
        XLSX.writeFile(workbook, filename)
    }


    // User Management Functions
    const handleResetPassword = async (userId) => {
        if (!confirm('Are you sure you want to reset this user\'s password? A new password will be emailed to them.')) {
            return
        }

        setActionLoading(userId)
        try {
            const response = await api.post(`/users/${userId}/reset-password`)
            alert(`✅ Password reset successful!\n\nNew password: ${response.data.newPassword}\n\n${response.data.emailSent ? 'Email sent to user.' : 'Email sending failed - please share password manually.'}`)
        } catch (error) {
            alert('Error resetting password: ' + (error.response?.data?.error || error.message))
        } finally {
            setActionLoading(null)
        }
    }

    const handleDeleteUser = async () => {
        if (!deleteConfirmModal.user) return

        setActionLoading(deleteConfirmModal.user._id)
        try {
            await api.delete(`/users/${deleteConfirmModal.user._id}`)
            alert('User deleted successfully.')
            setDeleteConfirmModal({ open: false, user: null })
            await fetchData()
        } catch (error) {
            alert('Error deleting user: ' + (error.response?.data?.error || error.message))
        } finally {
            setActionLoading(null)
        }
    }

    const handleChangeRole = async (userId, newRole) => {
        setActionLoading(userId)
        try {
            await api.patch(`/users/${userId}/role`, { role: newRole })
            alert(`Role changed to ${newRole} successfully.`)
            await fetchData()
        } catch (error) {
            alert('Error changing role: ' + (error.response?.data?.error || error.message))
        } finally {
            setActionLoading(null)
        }
    }

    // Gallery Functions
    const handleGalleryUpload = async (e) => {
        e.preventDefault()
        if (galleryForm.files.length === 0) {
            alert('Please select at least one image.')
            return
        }

        setActionLoading('gallery')
        try {
            const formData = new FormData()
            formData.append('title', galleryForm.title)
            formData.append('description', galleryForm.description)
            formData.append('category', galleryForm.category)
            formData.append('uploadedBy', user?._id)

            for (const file of galleryForm.files) {
                formData.append('images', file)
            }

            await api.post('/gallery', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            alert('Images uploaded successfully!')
            setGalleryUploadModal(false)
            setGalleryForm({ title: '', description: '', category: 'event', files: [] })
            await fetchData()
        } catch (error) {
            alert('Error uploading images: ' + (error.response?.data?.error || error.message))
        } finally {
            setActionLoading(null)
        }
    }

    const handleDeleteGalleryImage = async (imageId) => {
        if (!confirm('Are you sure you want to delete this image?')) return

        setActionLoading(imageId)
        try {
            await api.delete(`/gallery/${imageId}`)
            await fetchData()
        } catch (error) {
            alert('Error deleting image: ' + (error.response?.data?.error || error.message))
        } finally {
            setActionLoading(null)
        }
    }

    return (
        <div className="dashboard-page" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Background */}
            <div className="hero-bg" style={{ zIndex: 0, opacity: 0.5 }}>
                <div className="hero-grid" />
                <div className="hero-glow hero-glow-1" style={{ top: '-20%', left: '20%', opacity: 0.3 }} />
            </div>

            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="logo-icon-small">SS</div>
                        <span>Summit 2.0</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'registrations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('registrations')}
                    >
                        <Users size={20} />
                        <span>All Registrations</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <UserCog size={20} />
                        <span>User Management</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'announcements' ? 'active' : ''}`}
                        onClick={() => setActiveTab('announcements')}
                    >
                        <Bell size={20} />
                        <span>Announcements</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
                        onClick={() => setActiveTab('gallery')}
                    >
                        <Image size={20} />
                        <span>Gallery</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main" style={{ position: 'relative', zIndex: 1 }}>
                <header className="dashboard-header">
                    <div className="header-content">
                        <h1>Welcome, {user?.name || 'Faculty'}!</h1>
                        <p>Faculty Dashboard - {
                            activeTab === 'registrations' ? 'View All Registrations' :
                                activeTab === 'users' ? 'User Management' :
                                    activeTab === 'announcements' ? 'Announcements' :
                                        'Gallery Management'
                        }</p>
                    </div>
                    <div className="header-actions">
                        <span className="badge badge-warning">Faculty</span>
                    </div>
                </header>

                <div className="dashboard-content">
                    {/* All Registrations Tab */}
                    {activeTab === 'registrations' && (
                        <>
                            <div className="stats-row">
                                <div className="stat-card-small card">
                                    <div className="stat-icon">
                                        <Users size={24} />
                                    </div>
                                    <div className="stat-info">
                                        <span className="stat-value-small">{participants.length}</span>
                                        <span className="stat-label-small">Total Registrations</span>
                                    </div>
                                </div>
                            </div>

                            <section className="dashboard-section">
                                <div className="filters-row">
                                    <div className="search-box">
                                        <Search size={18} className="search-icon" />
                                        <input
                                            type="text"
                                            className="input search-input"
                                            placeholder="Search by name, email, or college..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>



                                    <button className="btn btn-primary" onClick={handleExport}>
                                        <Download size={18} />
                                        Export to Excel
                                    </button>
                                </div>
                            </section>

                            <section className="dashboard-section">
                                <div className="table-container card">
                                    {loading ? (
                                        <div className="table-loading">
                                            <div className="loading-spinner-small"></div>
                                            <span>Loading registrations...</span>
                                        </div>
                                    ) : (
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Password</th>
                                                    <th>College</th>
                                                    <th>Phone</th>
                                                    <th>Selected Events</th>
                                                    <th>Payment Ref</th>
                                                    <th>Registered On</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredParticipants.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="9" className="table-empty">
                                                            No registrations found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredParticipants.map((participant, index) => (
                                                        <tr key={participant.id || index}>
                                                            <td>{index + 1}</td>
                                                            <td className="name-cell">{participant.name}</td>
                                                            <td>{participant.email}</td>
                                                            <td className="password-cell">
                                                                <code style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '2px 6px', borderRadius: '4px' }}>
                                                                    {participant.generatedPassword || 'N/A'}
                                                                </code>
                                                            </td>
                                                            <td>{participant.college}</td>
                                                            <td>{participant.phone}</td>
                                                            <td>
                                                                <div className="events-badges">
                                                                    {(participant.selectedEvents || []).length > 0 ? (
                                                                        participant.selectedEvents.map((evt, i) => (
                                                                            <span key={i} className="event-badge">{evt}</span>
                                                                        ))
                                                                    ) : (
                                                                        <span className="text-muted">All Events</span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td><code>{participant.paymentRef}</code></td>
                                                            <td className="timestamp-cell">{participant.timestamp}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    )}
                                </div>

                                <div className="table-footer">
                                    <span className="results-count">
                                        Showing {filteredParticipants.length} of {participants.length} registrations
                                    </span>
                                </div>
                            </section>
                        </>
                    )}

                    {/* User Management Tab */}
                    {activeTab === 'users' && (
                        <section className="dashboard-section">
                            <div className="section-header">
                                <h2><UserCog size={20} /> User Management</h2>
                                <p>Manage all users, reset passwords, and change roles</p>
                            </div>

                            <div className="users-stats">
                                <div className="stat-card">
                                    <span className="stat-value">{allUsers.filter(u => u.role === 'participant').length}</span>
                                    <span className="stat-label">Participants</span>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-value">{allUsers.filter(u => u.role === 'coordinator').length}</span>
                                    <span className="stat-label">Coordinators</span>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-value">{allUsers.filter(u => u.role === 'faculty').length}</span>
                                    <span className="stat-label">Faculty</span>
                                </div>
                            </div>

                            <div className="table-container">
                                {loading ? (
                                    <div className="loading-state">Loading users...</div>
                                ) : (
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Password</th>
                                                <th>Role</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allUsers.map(u => (
                                                <tr key={u._id}>
                                                    <td>
                                                        <strong>{u.name}</strong>
                                                        {u.college && <span className="text-muted"><br />{u.college}</span>}
                                                    </td>
                                                    <td>{u.email}</td>
                                                    <td>
                                                        <code style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '2px 6px', borderRadius: '4px' }}>
                                                            {u.generatedPassword || 'N/A'}
                                                        </code>
                                                    </td>
                                                    <td>
                                                        <select
                                                            className="role-select"
                                                            value={u.role}
                                                            onChange={(e) => handleChangeRole(u._id, e.target.value)}
                                                            disabled={u.role === 'faculty' || actionLoading === u._id}
                                                        >
                                                            <option value="participant">Participant</option>
                                                            <option value="coordinator">Coordinator</option>
                                                            <option value="faculty">Faculty</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <span className={`badge badge-${u.verificationStatus === 'approved' ? 'success' : u.verificationStatus === 'rejected' ? 'danger' : 'warning'}`}>
                                                            {u.verificationStatus || 'active'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button
                                                                className="btn-icon btn-warning"
                                                                onClick={() => handleResetPassword(u._id)}
                                                                disabled={actionLoading === u._id}
                                                                title="Reset Password"
                                                            >
                                                                <Key size={16} />
                                                            </button>
                                                            {u.role !== 'faculty' && (
                                                                <button
                                                                    className="btn-icon btn-danger"
                                                                    onClick={() => setDeleteConfirmModal({ open: true, user: u })}
                                                                    disabled={actionLoading === u._id}
                                                                    title="Delete User"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Gallery Management Tab */}
                    {activeTab === 'gallery' && (
                        <section className="dashboard-section">
                            <div className="section-header">
                                <h2><Image size={20} /> Gallery Management</h2>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setGalleryUploadModal(true)}
                                >
                                    <ImagePlus size={18} />
                                    Upload Images
                                </button>
                            </div>

                            <div className="gallery-grid">
                                {loading ? (
                                    <div className="loading-state">Loading gallery...</div>
                                ) : galleryImages.length === 0 ? (
                                    <div className="empty-state">
                                        <Image size={48} />
                                        <p>No images in gallery yet</p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setGalleryUploadModal(true)}
                                        >
                                            Upload First Image
                                        </button>
                                    </div>
                                ) : (
                                    galleryImages.map(img => (
                                        <div key={img._id} className="gallery-card">
                                            <div className="gallery-image">
                                                <img src={img.thumbnailUrl || img.url} alt={img.title} />
                                            </div>
                                            <div className="gallery-info">
                                                <h4>{img.title}</h4>
                                                <span className="badge badge-info">{img.category}</span>
                                            </div>
                                            <div className="gallery-actions">
                                                <button
                                                    className="btn-icon btn-danger"
                                                    onClick={() => handleDeleteGalleryImage(img._id)}
                                                    disabled={actionLoading === img._id}
                                                    title="Delete Image"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    )}

                    {/* Announcements Tab */}
                    {activeTab === 'announcements' && (
                        <div className="dashboard-section">
                            <div className="section-header-row">
                                <h2>Manage Announcements</h2>
                            </div>

                            <div className="announcement-form card" style={{ marginBottom: '2rem' }}>
                                <h3>Create New Announcement</h3>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Announcement title"
                                        value={newAnnouncement.title}
                                        onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Content</label>
                                    <textarea
                                        className="input textarea"
                                        placeholder="Announcement content..."
                                        rows={4}
                                        value={newAnnouncement.content}
                                        onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                                    ></textarea>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleAddAnnouncement}
                                    disabled={!newAnnouncement.title || !newAnnouncement.content || actionLoading === 'announcement'}
                                >
                                    {actionLoading === 'announcement' ? 'Posting...' : 'Post Announcement'}
                                </button>
                            </div>

                            <h3>Posted Announcements</h3>
                            {announcements.length > 0 ? (
                                <div className="announcements-list">
                                    {announcements.map(announcement => (
                                        <div key={announcement._id} className="announcement-item card">
                                            <div className="announcement-header">
                                                <h4>{announcement.title}</h4>
                                                <div className="announcement-actions">
                                                    <span className="announcement-date">
                                                        {new Date(announcement.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => handleDeleteAnnouncement(announcement._id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p>{announcement.content}</p>
                                            <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#666' }}>
                                                Posted by: {announcement.postedBy?.name || 'Unknown'} ({announcement.role})
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <Bell size={48} />
                                    <p>No announcements yet</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>



            {/* Delete Confirmation Modal */}
            {deleteConfirmModal.open && (
                <div className="modal-overlay" onClick={() => setDeleteConfirmModal({ open: false, user: null })}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setDeleteConfirmModal({ open: false, user: null })}>
                            <X size={24} />
                        </button>
                        <h3><AlertTriangle color="#ef4444" /> Delete User</h3>
                        <p>Are you sure you want to delete <strong>{deleteConfirmModal.user?.name}</strong>?</p>
                        <p className="text-muted">This action cannot be undone. All associated registrations will also be deleted.</p>
                        <div className="modal-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setDeleteConfirmModal({ open: false, user: null })}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDeleteUser}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Deleting...' : 'Delete User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Gallery Upload Modal */}
            {galleryUploadModal && (
                <div className="modal-overlay" onClick={() => setGalleryUploadModal(false)}>
                    <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setGalleryUploadModal(false)}>
                            <X size={24} />
                        </button>
                        <h3><ImagePlus size={24} /> Upload Gallery Images</h3>
                        <form onSubmit={handleGalleryUpload}>
                            <div className="input-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Enter image title..."
                                    value={galleryForm.title}
                                    onChange={(e) => setGalleryForm(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div className="input-group">
                                <label>Description (optional)</label>
                                <textarea
                                    className="input"
                                    rows={2}
                                    placeholder="Enter description..."
                                    value={galleryForm.description}
                                    onChange={(e) => setGalleryForm(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>
                            <div className="input-group">
                                <label>Category</label>
                                <select
                                    className="input"
                                    value={galleryForm.category}
                                    onChange={(e) => setGalleryForm(prev => ({ ...prev, category: e.target.value }))}
                                >
                                    <option value="event">Event</option>
                                    <option value="workshop">Workshop</option>
                                    <option value="networking">Networking</option>
                                    <option value="venue">Venue</option>
                                    <option value="speaker">Speaker</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Images</label>
                                <input
                                    type="file"
                                    className="input"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => setGalleryForm(prev => ({ ...prev, files: Array.from(e.target.files) }))}
                                />
                                {galleryForm.files.length > 0 && (
                                    <p className="text-muted">{galleryForm.files.length} file(s) selected</p>
                                )}
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setGalleryUploadModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={actionLoading === 'gallery'}
                                >
                                    {actionLoading === 'gallery' ? 'Uploading...' : 'Upload Images'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FacultyDashboard

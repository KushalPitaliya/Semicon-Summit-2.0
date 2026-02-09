import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Users, Download, Filter, Search, LogOut,
    CheckCircle, XCircle, Eye, Clock, Image,
    AlertTriangle, X, Key, Trash2, UserCog, Upload, ImagePlus
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import * as XLSX from 'xlsx'
import './Dashboard.css'


const FacultyDashboard = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('pending')
    const [participants, setParticipants] = useState([])
    const [pendingVerifications, setPendingVerifications] = useState([])
    const [filteredParticipants, setFilteredParticipants] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedEvent, setSelectedEvent] = useState('all')
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
    const [rejectModal, setRejectModal] = useState({ open: false, user: null, reason: '' })

    // User Management State
    const [allUsers, setAllUsers] = useState([])
    const [userManagementModal, setUserManagementModal] = useState({ open: false, user: null, action: null })
    const [deleteConfirmModal, setDeleteConfirmModal] = useState({ open: false, user: null })

    // Gallery State
    const [galleryImages, setGalleryImages] = useState([])
    const [galleryUploadModal, setGalleryUploadModal] = useState(false)
    const [galleryForm, setGalleryForm] = useState({ title: '', description: '', category: 'event', files: [] })

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
            // Fetch pending verifications
            const pendingRes = await api.get('/admin/pending')
            setPendingVerifications(pendingRes.data)

            // Fetch all verified participants
            const participantsRes = await api.get('/participants')
            setParticipants(participantsRes.data)
            setFilteredParticipants(participantsRes.data)

            // Fetch all users for user management
            const usersRes = await api.get('/users')
            setAllUsers(usersRes.data)

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

    const handleVerify = async (userId) => {
        setActionLoading(userId)
        try {
            const response = await api.post(`/admin/verify/${userId}`, {
                verifierId: user?._id
            })

            // Show success with generated password
            alert(`✅ User verified!\n\nGenerated password: ${response.data.generatedPassword}\n\nEmail ${response.data.emailSent ? 'sent successfully!' : 'sending failed - share password manually.'}`)

            // Refresh data
            await fetchData()
        } catch (error) {
            alert('Error verifying user: ' + (error.response?.data?.error || error.message))
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async () => {
        if (!rejectModal.user) return

        setActionLoading(rejectModal.user._id)
        try {
            await api.post(`/admin/reject/${rejectModal.user._id}`, {
                reason: rejectModal.reason,
                verifierId: user?._id
            })

            alert('User registration rejected.')
            setRejectModal({ open: false, user: null, reason: '' })
            await fetchData()
        } catch (error) {
            alert('Error rejecting user: ' + (error.response?.data?.error || error.message))
        } finally {
            setActionLoading(null)
        }
    }

    const handleExport = () => {
        // Prepare data for Excel
        const excelData = filteredParticipants.map((p, index) => ({
            'S.No': index + 1,
            'Name': p.name || '',
            'Email': p.email || '',
            'Phone': p.phone || '',
            'College': p.college || '',
            'Events': (p.events || []).join(', '),
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
                    <button
                        className={`nav-item ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        <Clock size={20} />
                        <span>Pending Verification</span>
                        {pendingVerifications.length > 0 && (
                            <span className="nav-badge">{pendingVerifications.length}</span>
                        )}
                    </button>
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
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <h1>Welcome, {user?.name || 'Faculty'}!</h1>
                        <p>Faculty Dashboard - {
                            activeTab === 'pending' ? 'Payment Verification' :
                                activeTab === 'registrations' ? 'View All Registrations' :
                                    activeTab === 'users' ? 'User Management' :
                                        'Gallery Management'
                        }</p>
                    </div>
                    <div className="header-actions">
                        <span className="badge badge-warning">Faculty</span>
                    </div>
                </header>

                <div className="dashboard-content">
                    {/* Pending Verifications Tab */}
                    {activeTab === 'pending' && (
                        <section className="dashboard-section">
                            <div className="section-header">
                                <h2><Clock size={24} /> Pending Verifications</h2>
                                <span className="pending-count">{pendingVerifications.length} awaiting review</span>
                            </div>

                            {loading ? (
                                <div className="loading-state">
                                    <div className="loading-spinner-small"></div>
                                    <span>Loading pending verifications...</span>
                                </div>
                            ) : pendingVerifications.length === 0 ? (
                                <div className="empty-state card">
                                    <CheckCircle size={48} />
                                    <h3>All Caught Up!</h3>
                                    <p>No pending verifications at the moment.</p>
                                </div>
                            ) : (
                                <div className="verification-grid">
                                    {pendingVerifications.map(pendingUser => (
                                        <div key={pendingUser._id} className="verification-card card">
                                            <div className="verification-header">
                                                <div className="user-info">
                                                    <h3>{pendingUser.name}</h3>
                                                    <span className="email">{pendingUser.email}</span>
                                                </div>
                                                <span className="pending-badge">
                                                    <AlertTriangle size={14} />
                                                    Pending
                                                </span>
                                            </div>

                                            <div className="verification-details">
                                                <div className="detail-row">
                                                    <span className="label">Phone:</span>
                                                    <span className="value">{pendingUser.phone}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="label">College:</span>
                                                    <span className="value">{pendingUser.college || 'N/A'}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="label">Transaction ID:</span>
                                                    <code className="value">{pendingUser.transactionId}</code>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="label">Amount:</span>
                                                    <span className="value amount">₹{pendingUser.paymentAmount || 400}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="label">Events:</span>
                                                    <div className="events-badges">
                                                        {pendingUser.selectedEvents?.map((event, i) => (
                                                            <span key={i} className="event-badge">{event}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {pendingUser.paymentScreenshot && (
                                                <button
                                                    className="btn btn-secondary screenshot-btn"
                                                    onClick={() => setPreviewImage(`http://localhost:3001${pendingUser.paymentScreenshot}`)}
                                                >
                                                    <Image size={16} />
                                                    View Payment Screenshot
                                                </button>
                                            )}

                                            <div className="verification-actions">
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => handleVerify(pendingUser._id)}
                                                    disabled={actionLoading === pendingUser._id}
                                                >
                                                    {actionLoading === pendingUser._id ? (
                                                        <span className="loading-spinner-small"></span>
                                                    ) : (
                                                        <>
                                                            <CheckCircle size={16} />
                                                            Approve
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => setRejectModal({ open: true, user: pendingUser, reason: '' })}
                                                    disabled={actionLoading === pendingUser._id}
                                                >
                                                    <XCircle size={16} />
                                                    Reject
                                                </button>
                                            </div>

                                            <div className="verification-footer">
                                                <span className="timestamp">
                                                    Registered: {new Date(pendingUser.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

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
                                <div className="stat-card-small card">
                                    <div className="stat-icon pending">
                                        <Clock size={24} />
                                    </div>
                                    <div className="stat-info">
                                        <span className="stat-value-small">{pendingVerifications.length}</span>
                                        <span className="stat-label-small">Pending Verification</span>
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

                                    <div className="filter-group">
                                        <Filter size={18} />
                                        <select
                                            className="input select-input"
                                            value={selectedEvent}
                                            onChange={(e) => setSelectedEvent(e.target.value)}
                                        >
                                            <option value="all">All Events</option>
                                            {events.slice(1).map(event => (
                                                <option key={event} value={event}>{event}</option>
                                            ))}
                                        </select>
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
                                                    <th>College</th>
                                                    <th>Phone</th>
                                                    <th>Events</th>
                                                    <th>Payment Ref</th>
                                                    <th>Registered On</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredParticipants.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="8" className="table-empty">
                                                            No registrations found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredParticipants.map((participant, index) => (
                                                        <tr key={participant.id || index}>
                                                            <td>{index + 1}</td>
                                                            <td className="name-cell">{participant.name}</td>
                                                            <td>{participant.email}</td>
                                                            <td>{participant.college}</td>
                                                            <td>{participant.phone}</td>
                                                            <td>
                                                                <div className="events-badges">
                                                                    {(participant.events || []).map((event, i) => (
                                                                        <span key={i} className="event-badge">{event}</span>
                                                                    ))}
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
                </div>
            </main>

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="modal-overlay" onClick={() => setPreviewImage(null)}>
                    <div className="modal-content image-preview-modal" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setPreviewImage(null)}>
                            <X size={24} />
                        </button>
                        <h3>Payment Screenshot</h3>
                        <img src={previewImage} alt="Payment Screenshot" />
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {rejectModal.open && (
                <div className="modal-overlay" onClick={() => setRejectModal({ open: false, user: null, reason: '' })}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setRejectModal({ open: false, user: null, reason: '' })}>
                            <X size={24} />
                        </button>
                        <h3>Reject Registration</h3>
                        <p>Rejecting registration for: <strong>{rejectModal.user?.name}</strong></p>
                        <div className="input-group">
                            <label>Reason for rejection:</label>
                            <textarea
                                className="input"
                                rows={3}
                                placeholder="Enter reason for rejection..."
                                value={rejectModal.reason}
                                onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
                            />
                        </div>
                        <div className="modal-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setRejectModal({ open: false, user: null, reason: '' })}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleReject}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Processing...' : 'Confirm Rejection'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

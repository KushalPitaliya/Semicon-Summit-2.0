import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Upload, Image, FileText, Bell, LogOut,
    Plus, Trash2, CheckCircle, X, AlertCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import './Dashboard.css'

const CoordinatorDashboard = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('photos')
    const [uploads, setUploads] = useState({
        photos: [],
        documents: [],
        // announcements removed from here
    })
    const [announcements, setAnnouncements] = useState([]) // Real API state
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' })
    const fileInputRef = useRef(null)
    const docInputRef = useRef(null)

    useEffect(() => {
        fetchAnnouncements()
    }, [])

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get('/announcements')
            setAnnouncements(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/', { replace: true })
    }

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files)
        if (files.length > 0) {
            const newPhotos = files.map(file => ({
                id: Date.now() + Math.random(),
                name: file.name,
                size: formatFileSize(file.size),
                preview: URL.createObjectURL(file),
                uploaded: new Date().toLocaleDateString()
            }))
            setUploads(prev => ({
                ...prev,
                photos: [...prev.photos, ...newPhotos]
            }))
            setUploadStatus({ type: 'success', message: `${files.length} photo(s) uploaded successfully` })
            setTimeout(() => setUploadStatus(null), 3000)
        }
    }

    const handleDocUpload = (e) => {
        const files = Array.from(e.target.files)
        if (files.length > 0) {
            const newDocs = files.map(file => ({
                id: Date.now() + Math.random(),
                name: file.name,
                size: formatFileSize(file.size),
                type: file.type,
                uploaded: new Date().toLocaleDateString()
            }))
            setUploads(prev => ({
                ...prev,
                documents: [...prev.documents, ...newDocs]
            }))
            setUploadStatus({ type: 'success', message: `${files.length} document(s) uploaded successfully` })
            setTimeout(() => setUploadStatus(null), 3000)
        }
    }

    const handleAddAnnouncement = async () => {
        if (newAnnouncement.title && newAnnouncement.content) {
            try {
                await api.post('/announcements', {
                    ...newAnnouncement,
                    role: 'coordinator',
                    postedBy: user._id
                })
                setNewAnnouncement({ title: '', content: '' })
                setUploadStatus({ type: 'success', message: 'Announcement posted successfully' })
                fetchAnnouncements()
                setTimeout(() => setUploadStatus(null), 3000)
            } catch (err) {
                setUploadStatus({ type: 'error', message: 'Failed to post announcement' })
            }
        }
    }

    const handleDelete = async (type, id) => {
        if (type === 'announcements') {
            if (!confirm('Delete this announcement?')) return
            try {
                await api.delete(`/announcements/${id}`)
                fetchAnnouncements()
            } catch (err) {
                alert('Failed to delete')
            }
            return
        }

        // Local state delete for photos/docs
        setUploads(prev => ({
            ...prev,
            [type]: prev[type].filter(item => item.id !== id)
        }))
    }

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    const tabs = [
        { id: 'photos', label: 'Photos', icon: Image },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'announcements', label: 'Announcements', icon: Bell }
    ]

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
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            <tab.icon size={20} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
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
                        <h1>Welcome, {user?.name || 'Coordinator'}!</h1>
                        <p>Student Coordinator Dashboard</p>
                    </div>
                    <div className="header-actions">
                        <span className="badge badge-primary">Coordinator</span>
                    </div>
                </header>

                {/* Upload Status */}
                {uploadStatus && (
                    <div className={`upload-status ${uploadStatus.type}`}>
                        {uploadStatus.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span>{uploadStatus.message}</span>
                        <button onClick={() => setUploadStatus(null)}><X size={16} /></button>
                    </div>
                )}

                <div className="dashboard-content">
                    {/* Photos Tab */}
                    {activeTab === 'photos' && (
                        <section className="dashboard-section">
                            <div className="section-header-row">
                                <h2>Upload Photos</h2>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Plus size={18} />
                                    Upload Photos
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    hidden
                                    onChange={handlePhotoUpload}
                                />
                            </div>

                            <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                                <Upload size={40} />
                                <p>Drag and drop photos here or click to browse</p>
                                <span>Supports: JPG, PNG, GIF (Max 10MB each)</span>
                            </div>

                            {uploads.photos.length > 0 && (
                                <div className="uploaded-grid">
                                    {uploads.photos.map(photo => (
                                        <div key={photo.id} className="uploaded-item card">
                                            <div className="uploaded-preview">
                                                <img src={photo.preview} alt={photo.name} />
                                            </div>
                                            <div className="uploaded-info">
                                                <span className="uploaded-name">{photo.name}</span>
                                                <span className="uploaded-meta">{photo.size} • {photo.uploaded}</span>
                                            </div>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete('photos', photo.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Documents Tab */}
                    {activeTab === 'documents' && (
                        <section className="dashboard-section">
                            <div className="section-header-row">
                                <h2>Upload Documents</h2>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => docInputRef.current?.click()}
                                >
                                    <Plus size={18} />
                                    Upload Documents
                                </button>
                                <input
                                    ref={docInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                                    multiple
                                    hidden
                                    onChange={handleDocUpload}
                                />
                            </div>

                            <div className="upload-zone" onClick={() => docInputRef.current?.click()}>
                                <FileText size={40} />
                                <p>Drag and drop documents here or click to browse</p>
                                <span>Supports: PDF, DOC, DOCX, PPT, PPTX (Max 25MB each)</span>
                            </div>

                            {uploads.documents.length > 0 && (
                                <div className="documents-list">
                                    {uploads.documents.map(doc => (
                                        <div key={doc.id} className="document-item card">
                                            <div className="document-icon">
                                                <FileText size={24} />
                                            </div>
                                            <div className="document-info">
                                                <span className="document-name">{doc.name}</span>
                                                <span className="document-meta">{doc.size} • {doc.uploaded}</span>
                                            </div>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete('documents', doc.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Announcements Tab */}
                    {activeTab === 'announcements' && (
                        <section className="dashboard-section">
                            <div className="section-header-row">
                                <h2>Manage Announcements</h2>
                            </div>

                            <div className="announcement-form card">
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
                                    disabled={!newAnnouncement.title || !newAnnouncement.content}
                                >
                                    <Plus size={18} />
                                    Post Announcement
                                </button>
                            </div>

                            {announcements.length > 0 && (
                                <div className="announcements-list">
                                    <h3>Posted Announcements</h3>
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
                                                        onClick={() => handleDelete('announcements', announcement._id)}
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
                            )}
                        </section>
                    )}
                </div>
            </main>
        </div>
    )
}

export default CoordinatorDashboard

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Auth API
export const authAPI = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password })
        return response.data
    },

    validateToken: async (token) => {
        const response = await api.get('/auth/validate', {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    }
}

// Participants API (for Faculty dashboard)
export const participantsAPI = {
    getAll: async () => {
        const response = await api.get('/participants')
        return response.data
    },

    getByEvent: async (eventName) => {
        const response = await api.get(`/participants?event=${encodeURIComponent(eventName)}`)
        return response.data
    },

    exportToCSV: async () => {
        const response = await api.get('/participants/export', { responseType: 'blob' })
        return response.data
    }
}

// Announcements API
export const announcementsAPI = {
    getAll: async () => {
        const response = await api.get('/announcements')
        return response.data
    },

    create: async (announcement) => {
        const response = await api.post('/announcements', announcement)
        return response.data
    },

    delete: async (id) => {
        const response = await api.delete(`/announcements/${id}`)
        return response.data
    }
}

// Uploads API (for Coordinator dashboard)
export const uploadsAPI = {
    uploadPhoto: async (file) => {
        const formData = new FormData()
        formData.append('photo', file)
        const response = await api.post('/uploads/photos', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data
    },

    uploadDocument: async (file) => {
        const formData = new FormData()
        formData.append('document', file)
        const response = await api.post('/uploads/documents', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data
    },

    getPhotos: async () => {
        const response = await api.get('/uploads/photos')
        return response.data
    },

    getDocuments: async () => {
        const response = await api.get('/uploads/documents')
        return response.data
    },

    delete: async (type, id) => {
        const response = await api.delete(`/uploads/${type}/${id}`)
        return response.data
    }
}

export default api

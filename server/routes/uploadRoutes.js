const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate, authorize } = require('../middleware/auth');

const uploadsDir = path.join(__dirname, '..', 'uploads');
const photosDir = path.join(uploadsDir, 'photos');
const docsDir = path.join(uploadsDir, 'documents');

// Ensure directories exist
[photosDir, docsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const type = req.path.includes('photos') ? 'photos' : 'documents';
        cb(null, path.join(uploadsDir, type));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const type = req.path.includes('photos') ? 'photos' : 'documents';
        if (type === 'photos') {
            const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            cb(null, allowed.includes(file.mimetype));
        } else {
            const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
            cb(null, allowed.includes(file.mimetype));
        }
    }
});

// In-memory storage for uploaded files
let uploadedFiles = {
    photos: [],
    documents: []
};

// Upload photos (Auth required)
router.post('/photos', authenticate, upload.array('photos', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    const newPhotos = req.files.map(file => ({
        id: Date.now() + Math.random(),
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        url: `/uploads/photos/${file.filename}`,
        uploadedAt: new Date().toISOString(),
        uploadedBy: req.user._id
    }));

    uploadedFiles.photos.push(...newPhotos);
    res.status(201).json(newPhotos);
});

// Upload documents (Auth required)
router.post('/documents', authenticate, upload.array('documents', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    const newDocs = req.files.map(file => ({
        id: Date.now() + Math.random(),
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        url: `/uploads/documents/${file.filename}`,
        uploadedAt: new Date().toISOString(),
        uploadedBy: req.user._id
    }));

    uploadedFiles.documents.push(...newDocs);
    res.status(201).json(newDocs);
});

// Get uploaded photos (Auth required)
router.get('/photos', authenticate, (req, res) => {
    res.json(uploadedFiles.photos);
});

// Get uploaded documents (Auth required)
router.get('/documents', authenticate, (req, res) => {
    res.json(uploadedFiles.documents);
});

// Delete uploaded file (Auth required)
router.delete('/:type/:id', authenticate, (req, res) => {
    const { type, id } = req.params;
    const numId = parseFloat(id);

    if (!['photos', 'documents'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    const index = uploadedFiles[type].findIndex(f => f.id === numId);
    if (index === -1) {
        return res.status(404).json({ error: 'File not found' });
    }

    const file = uploadedFiles[type][index];
    const filePath = path.join(uploadsDir, type, file.filename);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    uploadedFiles[type].splice(index, 1);
    res.json({ success: true });
});

module.exports = router;

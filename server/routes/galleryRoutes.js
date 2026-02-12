const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Gallery = require('../models/Gallery');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadImage, deleteImage, getThumbnailUrl } = require('../services/cloudinaryService');

const uploadsDir = path.join(__dirname, '..', 'uploads');

// Multer for temporary gallery uploads
const galleryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const tempDir = path.join(uploadsDir, 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        cb(null, `gallery-${Date.now()}-${file.originalname}`);
    }
});

const uploadGallery = multer({
    storage: galleryStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        cb(null, allowed.includes(file.mimetype));
    }
});

// Get all gallery images (Public)
router.get('/', async (req, res) => {
    try {
        const { category, featured, limit } = req.query;
        let query = { isActive: true };

        if (category) query.category = category;
        if (featured === 'true') query.isFeatured = true;

        let galleryQuery = Gallery.find(query)
            .populate('uploadedBy', 'name')
            .populate('event', 'title')
            .sort({ displayOrder: 1, createdAt: -1 });

        if (limit) galleryQuery = galleryQuery.limit(parseInt(limit));

        const images = await galleryQuery;
        res.json(images);
    } catch (error) {
        console.error('Get gallery error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get featured gallery images (Public)
router.get('/featured', async (req, res) => {
    try {
        const images = await Gallery.find({ isActive: true, isFeatured: true })
            .sort({ displayOrder: 1 })
            .limit(12);
        res.json(images);
    } catch (error) {
        console.error('Get featured gallery error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Upload gallery image(s) (Coordinator/Faculty only)
router.post('/', authenticate, authorize('coordinator', 'faculty'), uploadGallery.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No images uploaded' });
        }

        const { title, description, category, tags, eventId, isFeatured } = req.body;

        const cloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET;

        const uploadedImages = [];

        for (const file of req.files) {
            let imageData;

            if (cloudinaryConfigured) {
                const cloudinaryResult = await uploadImage(file.path, 'gallery');
                imageData = {
                    publicId: cloudinaryResult.publicId,
                    url: cloudinaryResult.url,
                    thumbnailUrl: getThumbnailUrl(cloudinaryResult.publicId),
                    width: cloudinaryResult.width,
                    height: cloudinaryResult.height,
                    format: cloudinaryResult.format,
                    bytes: cloudinaryResult.bytes
                };
                fs.unlinkSync(file.path);
            } else {
                const galleryDir = path.join(uploadsDir, 'gallery');
                if (!fs.existsSync(galleryDir)) {
                    fs.mkdirSync(galleryDir, { recursive: true });
                }
                const newPath = path.join(galleryDir, file.filename);
                fs.renameSync(file.path, newPath);

                imageData = {
                    publicId: file.filename,
                    url: `/uploads/gallery/${file.filename}`,
                    thumbnailUrl: `/uploads/gallery/${file.filename}`,
                    bytes: file.size
                };
            }

            let parsedTags = [];
            try {
                parsedTags = tags ? JSON.parse(tags) : [];
            } catch (e) {
                parsedTags = tags ? tags.split(',').map(t => t.trim()) : [];
            }

            const gallery = new Gallery({
                title: title || file.originalname,
                description,
                ...imageData,
                category: category || 'other',
                tags: parsedTags,
                event: eventId || null,
                uploadedBy: req.user._id,
                isFeatured: isFeatured === 'true'
            });

            await gallery.save();
            uploadedImages.push(gallery);
        }

        console.log(`📸 ${uploadedImages.length} image(s) uploaded to gallery`);
        res.status(201).json(uploadedImages);
    } catch (error) {
        console.error('Gallery upload error:', error);
        res.status(500).json({ error: 'Upload failed: ' + error.message });
    }
});

// Update gallery image (Coordinator/Faculty only)
router.put('/:id', authenticate, authorize('coordinator', 'faculty'), async (req, res) => {
    try {
        const image = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }
        res.json(image);
    } catch (error) {
        console.error('Update gallery error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete gallery image (Faculty only)
router.delete('/:id', authenticate, authorize('faculty'), async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const cloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET;

        if (cloudinaryConfigured && image.publicId && !image.publicId.includes('/uploads/')) {
            await deleteImage(image.publicId);
        } else if (image.url.startsWith('/uploads/')) {
            const localPath = path.join(__dirname, '..', image.url);
            if (fs.existsSync(localPath)) {
                fs.unlinkSync(localPath);
            }
        }

        await Gallery.findByIdAndDelete(req.params.id);

        console.log(`🗑️ Gallery image deleted: ${image.title}`);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete gallery error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

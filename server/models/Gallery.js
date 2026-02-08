const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    // Cloudinary fields
    publicId: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String
    },
    // Image metadata
    width: {
        type: Number
    },
    height: {
        type: Number
    },
    format: {
        type: String
    },
    bytes: {
        type: Number
    },
    // Categorization
    category: {
        type: String,
        enum: ['event', 'workshop', 'networking', 'venue', 'speaker', 'other'],
        default: 'other'
    },
    tags: [{
        type: String,
        trim: true
    }],
    // Event reference (optional)
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    // Featured flag for homepage gallery
    isFeatured: {
        type: Boolean,
        default: false
    },
    // Display order for featured images
    displayOrder: {
        type: Number,
        default: 0
    },
    // Uploaded by
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for quick queries
gallerySchema.index({ category: 1, isFeatured: 1 });
gallerySchema.index({ tags: 1 });

module.exports = mongoose.model('Gallery', gallerySchema);

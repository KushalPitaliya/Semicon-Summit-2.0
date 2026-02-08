const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['upi', 'card', 'netbanking', 'cash'],
        default: 'upi'
    },
    paymentReference: {
        type: String
    },
    paymentScreenshot: {
        type: String
    },
    amount: {
        type: Number,
        default: 0
    },
    attendanceStatus: {
        type: String,
        enum: ['registered', 'attended', 'absent', 'cancelled'],
        default: 'registered'
    },
    certificateIssued: {
        type: Boolean,
        default: false
    },
    feedback: {
        rating: { type: Number, min: 1, max: 5 },
        comment: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate registrations
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);

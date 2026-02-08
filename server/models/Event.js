const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Event description is required']
    },
    date: {
        type: Date,
        required: [true, 'Event date is required']
    },
    time: {
        type: String,
        required: [true, 'Event time is required']
    },
    venue: {
        type: String,
        required: [true, 'Event venue is required']
    },
    category: {
        type: String,
        enum: ['workshop', 'hackathon', 'talk', 'competition', 'networking'],
        default: 'workshop'
    },
    capacity: {
        type: Number,
        default: 100
    },
    registeredCount: {
        type: Number,
        default: 0
    },
    registrationFee: {
        type: Number,
        default: 0
    },
    speakers: [{
        name: String,
        designation: String,
        company: String,
        photo: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Virtual for checking if event is full
eventSchema.virtual('isFull').get(function () {
    return this.registeredCount >= this.capacity;
});

// Virtual for remaining seats
eventSchema.virtual('remainingSeats').get(function () {
    return this.capacity - this.registeredCount;
});

// Include virtuals in JSON
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);

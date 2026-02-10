require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// MongoDB connection
const connectDB = require('./config/database');

// Models
const User = require('./models/User');
const Event = require('./models/Event');
const Announcement = require('./models/Announcement');
const Registration = require('./models/Registration');
const Gallery = require('./models/Gallery');

// Services
const { generatePassword, sendCredentialsEmail, sendRejectionEmail, sendPasswordResetEmail } = require('./services/emailService');
const { uploadImage, uploadMultiple, deleteImage, getThumbnailUrl } = require('./services/cloudinaryService');

// Routes
const webhookRoutes = require('./routes/webhookRoutes');
const paymentVerificationRoutes = require('./routes/paymentVerificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));

// Webhook routes (must be before express.json() to handle raw body)
app.use('/api/webhooks', webhookRoutes);

// Payment verification routes
app.use('/api', paymentVerificationRoutes);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
const photosDir = path.join(uploadsDir, 'photos');
const docsDir = path.join(uploadsDir, 'documents');
const paymentsDir = path.join(uploadsDir, 'payments');

[uploadsDir, photosDir, docsDir, paymentsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Multer configuration for file uploads
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
    limits: {
        fileSize: 25 * 1024 * 1024 // 25MB max
    },
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

// Multer configuration for payment screenshots
const paymentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, paymentsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadPayment = multer({
    storage: paymentStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        cb(null, allowed.includes(file.mimetype));
    }
});

// In-memory storage for uploaded files (files are stored on disk)
let uploadedFiles = {
    photos: [],
    documents: []
};

// ==========================================
// AUTH ROUTES
// ==========================================
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user in MongoDB
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Return user data (password excluded by toJSON method)
        res.json(user);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Register new user
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, phone, college, department } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create new user
        const user = new User({
            name,
            email: email.toLowerCase(),
            password,
            phone,
            college,
            department,
            role: 'participant'
        });

        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==========================================
// PUBLIC REGISTRATION (with Razorpay payment)
// ==========================================
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, phone, college, department, selectedEvents, paymentAmount } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Name, email, and phone are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered. If you have already submitted, please wait for payment confirmation.' });
        }

        // Create new user with pending status
        const user = new User({
            name,
            email: email.toLowerCase(),
            phone,
            college,
            department,
            selectedEvents: Array.isArray(selectedEvents) ? selectedEvents :
                (typeof selectedEvents === 'string' ? JSON.parse(selectedEvents) : []),
            verificationStatus: 'pending',
            paymentStatus: 'pending',
            paymentAmount: 299, // Fixed registration fee
            role: 'participant'
        });

        await user.save();

        console.log(`✅ User registered (pending payment): ${user.name} (${user.email})`);

        res.status(201).json({
            message: 'Registration submitted successfully. Please complete payment to activate your account.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                selectedEvents: user.selectedEvents
            },
            // Return payment link with pre-filled information
            paymentLink: `https://rzp.io/rzp/NsZUsMqO?prefill[name]=${encodeURIComponent(name)}&prefill[email]=${encodeURIComponent(email)}&prefill[contact]=${encodeURIComponent(phone)}`
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// ==========================================
// ADMIN VERIFICATION ROUTES
// ==========================================
// Get pending verifications
app.get('/api/admin/pending', async (req, res) => {
    try {
        const pending = await User.find({ verificationStatus: 'pending' })
            .sort({ createdAt: -1 });
        res.json(pending);
    } catch (error) {
        console.error('Error fetching pending:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Approve registration
app.post('/api/admin/verify/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { verifierId } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.verificationStatus !== 'pending') {
            return res.status(400).json({ error: 'User already processed' });
        }

        // Generate password
        const password = generatePassword();

        // Update user
        user.password = password;
        user.verificationStatus = 'approved';
        user.paymentStatus = 'completed';
        user.verifiedBy = verifierId;
        user.verifiedAt = new Date();

        await user.save();

        // Send credentials email
        const emailSent = await sendCredentialsEmail(user, password);

        console.log(`✅ User verified: ${user.name} (${user.email})`);
        res.json({
            message: 'User verified successfully',
            user,
            emailSent,
            generatedPassword: password // Return for admin reference (in case email fails)
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Verification failed: ' + error.message });
    }
});

// Reject registration
app.post('/api/admin/reject/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { reason, verifierId } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.verificationStatus !== 'pending') {
            return res.status(400).json({ error: 'User already processed' });
        }

        // Update user
        user.verificationStatus = 'rejected';
        user.rejectionReason = reason || 'Payment verification failed';
        user.verifiedBy = verifierId;
        user.verifiedAt = new Date();

        await user.save();

        // Send rejection email
        await sendRejectionEmail(user, reason);

        console.log(`❌ User rejected: ${user.name} (${user.email})`);
        res.json({ message: 'User rejected', user });
    } catch (error) {
        console.error('Rejection error:', error);
        res.status(500).json({ error: 'Rejection failed: ' + error.message });
    }
});

// ==========================================
// USER ROUTES
// ==========================================
app.get('/api/users', async (req, res) => {
    try {
        const { role, event } = req.query;
        let query = {};

        if (role) {
            query.role = role;
        }

        const users = await User.find(query)
            .populate('registeredEvents')
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('registeredEvents');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==========================================
// PARTICIPANTS ROUTES (for Faculty)
// ==========================================
app.get('/api/participants', async (req, res) => {
    try {
        const { event } = req.query;
        let participants;

        if (event && event !== 'all') {
            // Find event by title
            const eventDoc = await Event.findOne({ title: event });
            if (eventDoc) {
                const registrations = await Registration.find({ event: eventDoc._id })
                    .populate('user')
                    .populate('event');
                participants = registrations.map(reg => ({
                    id: reg.user._id,
                    name: reg.user.name,
                    email: reg.user.email,
                    college: reg.user.college,
                    phone: reg.user.phone,
                    events: [reg.event.title],
                    paymentRef: reg.paymentReference,
                    timestamp: reg.registrationDate
                }));
            } else {
                participants = [];
            }
        } else {
            // Get all participants
            const users = await User.find({ role: 'participant' }).sort({ createdAt: -1 });
            const registrations = await Registration.find().populate('event');

            participants = users.map(user => {
                const userRegs = registrations.filter(r => r.user.toString() === user._id.toString());
                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    college: user.college,
                    phone: user.phone,
                    events: userRegs.map(r => r.event?.title || 'Unknown'),
                    paymentRef: user.paymentReference || userRegs[0]?.paymentReference,
                    timestamp: user.createdAt
                };
            });
        }

        res.json(participants);
    } catch (error) {
        console.error('Get participants error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/participants/export', async (req, res) => {
    try {
        const users = await User.find({ role: 'participant' }).sort({ createdAt: -1 });
        const registrations = await Registration.find().populate('event');

        const participants = users.map(user => {
            const userRegs = registrations.filter(r => r.user.toString() === user._id.toString());
            return {
                name: user.name,
                email: user.email,
                college: user.college,
                phone: user.phone,
                events: userRegs.map(r => r.event?.title || 'Unknown').join('; '),
                paymentRef: user.paymentReference || userRegs[0]?.paymentReference || '',
                timestamp: user.createdAt
            };
        });

        // Generate CSV
        const headers = ['Name', 'Email', 'College', 'Phone', 'Events', 'Payment Ref', 'Timestamp'];
        const csvContent = [
            headers.join(','),
            ...participants.map(p => [
                `"${p.name}"`,
                p.email,
                `"${p.college || ''}"`,
                p.phone || '',
                `"${p.events}"`,
                p.paymentRef,
                p.timestamp
            ].join(','))
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=registrations.csv');
        res.send(csvContent);
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==========================================
// EVENTS ROUTES
// ==========================================
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find({ isActive: true }).sort({ date: 1 });
        res.json(events);
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/events', async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==========================================
// REGISTRATION ROUTES
// ==========================================
app.post('/api/registrations', async (req, res) => {
    try {
        const { userId, eventId, paymentReference, paymentMethod, amount } = req.body;

        // Check if already registered
        const existingReg = await Registration.findOne({ user: userId, event: eventId });
        if (existingReg) {
            return res.status(400).json({ error: 'Already registered for this event' });
        }

        // Create registration
        const registration = new Registration({
            user: userId,
            event: eventId,
            paymentReference,
            paymentMethod,
            amount,
            paymentStatus: 'completed'
        });

        await registration.save();

        // Update event count
        await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });

        // Update user's registered events
        await User.findByIdAndUpdate(userId, { $push: { registeredEvents: eventId } });

        res.status(201).json(registration);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/registrations', async (req, res) => {
    try {
        const registrations = await Registration.find()
            .populate('user')
            .populate('event')
            .sort({ registrationDate: -1 });
        res.json(registrations);
    } catch (error) {
        console.error('Get registrations error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==========================================
// ANNOUNCEMENTS ROUTES
// ==========================================
app.get('/api/announcements', async (req, res) => {
    try {
        const announcements = await Announcement.find({ isActive: true })
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        console.error('Get announcements error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/announcements', async (req, res) => {
    try {
        const { title, content, priority, targetAudience, createdBy } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const announcement = new Announcement({
            title,
            content,
            priority: priority || 'normal',
            targetAudience: targetAudience || 'all',
            createdBy: createdBy || null
        });

        await announcement.save();
        res.status(201).json(announcement);
    } catch (error) {
        console.error('Create announcement error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/announcements/:id', async (req, res) => {
    try {
        const result = await Announcement.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Announcement not found' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Delete announcement error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==========================================
// UPLOADS ROUTES
// ==========================================
app.post('/api/uploads/photos', upload.array('photos', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    const newPhotos = req.files.map(file => ({
        id: Date.now() + Math.random(),
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        url: `/uploads/photos/${file.filename}`,
        uploadedAt: new Date().toISOString()
    }));

    uploadedFiles.photos.push(...newPhotos);
    res.status(201).json(newPhotos);
});

app.post('/api/uploads/documents', upload.array('documents', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    const newDocs = req.files.map(file => ({
        id: Date.now() + Math.random(),
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        url: `/uploads/documents/${file.filename}`,
        uploadedAt: new Date().toISOString()
    }));

    uploadedFiles.documents.push(...newDocs);
    res.status(201).json(newDocs);
});

app.get('/api/uploads/photos', (req, res) => {
    res.json(uploadedFiles.photos);
});

app.get('/api/uploads/documents', (req, res) => {
    res.json(uploadedFiles.documents);
});

app.delete('/api/uploads/:type/:id', (req, res) => {
    const { type, id } = req.params;
    const numId = parseFloat(id);

    if (!['photos', 'documents'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    const index = uploadedFiles[type].findIndex(f => f.id === numId);

    if (index === -1) {
        return res.status(404).json({ error: 'File not found' });
    }

    // Delete file from disk
    const file = uploadedFiles[type][index];
    const filePath = path.join(uploadsDir, type, file.filename);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    uploadedFiles[type].splice(index, 1);
    res.json({ success: true });
});

// ==========================================
// SEED DATABASE WITH DEMO DATA
// ==========================================
app.post('/api/seed', async (req, res) => {
    try {
        // Create demo users
        const demoUsers = [
            { name: 'John Participant', email: 'participant@demo.com', password: 'demo123', role: 'participant', college: 'Tech University', phone: '9876543210' },
            { name: 'Jane Coordinator', email: 'coordinator@demo.com', password: 'demo123', role: 'coordinator' },
            { name: 'Dr. Faculty', email: 'faculty@demo.com', password: 'demo123', role: 'faculty' }
        ];

        for (const userData of demoUsers) {
            const exists = await User.findOne({ email: userData.email });
            if (!exists) {
                const user = new User(userData);
                await user.save();
                console.log(`Created user: ${userData.email}`);
            }
        }

        // Create demo events
        const demoEvents = [
            { title: 'VLSI Design Workshop', description: 'Learn VLSI design fundamentals', date: new Date('2026-03-15'), time: '10:00 AM', venue: 'Hall A', category: 'workshop', capacity: 100, registrationFee: 400 },
            { title: 'Chip Architecture Talk', description: 'Expert talk on modern chip architectures', date: new Date('2026-03-15'), time: '2:00 PM', venue: 'Hall B', category: 'talk', capacity: 200, registrationFee: 0 },
            { title: 'Embedded Systems Hackathon', description: '24-hour hackathon', date: new Date('2026-03-16'), time: '9:00 AM', venue: 'Lab 1', category: 'hackathon', capacity: 50, registrationFee: 200 },
            { title: 'Industry Panel Discussion', description: 'Panel with industry leaders', date: new Date('2026-03-16'), time: '4:00 PM', venue: 'Main Hall', category: 'networking', capacity: 300, registrationFee: 0 }
        ];

        for (const eventData of demoEvents) {
            const exists = await Event.findOne({ title: eventData.title });
            if (!exists) {
                const event = new Event(eventData);
                await event.save();
                console.log(`Created event: ${eventData.title}`);
            }
        }

        res.json({ success: true, message: 'Demo data seeded successfully' });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ error: 'Seed failed: ' + error.message });
    }
});

// ==========================================
// USER MANAGEMENT ROUTES (Faculty)
// ==========================================

// Update user
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Don't allow password update through this route
        delete updates.password;

        const user = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prevent deleting faculty users
        if (user.role === 'faculty') {
            return res.status(403).json({ error: 'Cannot delete faculty users' });
        }

        // Delete associated registrations
        await Registration.deleteMany({ user: id });

        // Delete user
        await User.findByIdAndDelete(id);

        console.log(`🗑️ User deleted: ${user.name} (${user.email})`);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Reset user password (Faculty only)
app.post('/api/users/:id/reset-password', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate new password
        const newPassword = generatePassword();

        // Update user password
        user.password = newPassword;
        await user.save();

        // Send email with new password
        const emailSent = await sendPasswordResetEmail(user, newPassword);

        console.log(`🔐 Password reset for: ${user.name} (${user.email})`);
        res.json({
            success: true,
            message: 'Password reset successfully',
            emailSent,
            newPassword // Return for admin reference in case email fails
        });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ error: 'Password reset failed' });
    }
});

// Change user role
app.patch('/api/users/:id/role', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['participant', 'coordinator', 'faculty'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(`👤 Role changed for ${user.email}: ${role}`);
        res.json(user);
    } catch (error) {
        console.error('Change role error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==========================================
// GALLERY ROUTES (Cloudinary)
// ==========================================

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
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        cb(null, allowed.includes(file.mimetype));
    }
});

// Get all gallery images
app.get('/api/gallery', async (req, res) => {
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

// Get featured gallery images (for landing page)
app.get('/api/gallery/featured', async (req, res) => {
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

// Upload gallery image(s)
app.post('/api/gallery', uploadGallery.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No images uploaded' });
        }

        const { title, description, category, tags, eventId, uploadedBy, isFeatured } = req.body;

        // Check if Cloudinary is configured
        const cloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET;

        const uploadedImages = [];

        for (const file of req.files) {
            let imageData;

            if (cloudinaryConfigured) {
                // Upload to Cloudinary
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

                // Delete temp file
                fs.unlinkSync(file.path);
            } else {
                // Fallback: move to local gallery folder
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

            // Parse tags
            let parsedTags = [];
            try {
                parsedTags = tags ? JSON.parse(tags) : [];
            } catch (e) {
                parsedTags = tags ? tags.split(',').map(t => t.trim()) : [];
            }

            // Create gallery record
            const gallery = new Gallery({
                title: title || file.originalname,
                description,
                ...imageData,
                category: category || 'other',
                tags: parsedTags,
                event: eventId || null,
                uploadedBy: uploadedBy || null,
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

// Update gallery image
app.put('/api/gallery/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const image = await Gallery.findByIdAndUpdate(id, updates, { new: true });
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.json(image);
    } catch (error) {
        console.error('Update gallery error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete gallery image
app.delete('/api/gallery/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const image = await Gallery.findById(id);
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Check if Cloudinary is configured
        const cloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET;

        if (cloudinaryConfigured && image.publicId && !image.publicId.includes('/uploads/')) {
            // Delete from Cloudinary
            await deleteImage(image.publicId);
        } else if (image.url.startsWith('/uploads/')) {
            // Delete local file
            const localPath = path.join(__dirname, image.url);
            if (fs.existsSync(localPath)) {
                fs.unlinkSync(localPath);
            }
        }

        await Gallery.findByIdAndDelete(id);

        console.log(`🗑️ Gallery image deleted: ${image.title}`);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete gallery error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==========================================
// HEALTH CHECK
// ==========================================
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'MongoDB',
        cloudinary: !!(process.env.CLOUDINARY_CLOUD_NAME)
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Uploads directory: ${uploadsDir}`);
    console.log(`🗄️  Database: MongoDB`);
    console.log(`☁️  Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not configured (using local storage)'}`);
});

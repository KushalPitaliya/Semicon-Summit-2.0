const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { authenticate, authorize } = require('../middleware/auth');

// Get all users (Faculty only)
router.get('/', authenticate, authorize('faculty'), async (req, res) => {
    try {
        const { role } = req.query;
        let query = {};
        if (role) query.role = role;

        const users = await User.find(query)
            .populate('registeredEvents')
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single user
router.get('/:id', authenticate, async (req, res) => {
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

// Update user (Faculty only)
router.put('/:id', authenticate, authorize('faculty'), async (req, res) => {
    try {
        const updates = req.body;
        delete updates.password; // Don't allow password update through this route

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete user (Faculty only)
router.delete('/:id', authenticate, authorize('faculty'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role === 'faculty') {
            return res.status(403).json({ error: 'Cannot delete faculty users' });
        }

        await Registration.deleteMany({ user: req.params.id });
        await User.findByIdAndDelete(req.params.id);

        console.log(`🗑️ User deleted: ${user.name} (${user.email})`);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Reset user password (Faculty only)
router.post('/:id/reset-password', authenticate, authorize('faculty'), async (req, res) => {
    try {
        const { generatePassword, sendPasswordResetEmail } = require('../services/emailService');

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newPassword = generatePassword();
        user.password = newPassword;
        user.generatedPassword = newPassword;
        await user.save();

        const emailSent = await sendPasswordResetEmail(user, newPassword);

        console.log(`🔐 Password reset for: ${user.name} (${user.email})`);
        res.json({
            success: true,
            message: 'Password reset successfully',
            emailSent,
            newPassword
        });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ error: 'Password reset failed' });
    }
});

// Change user role (Faculty only)
router.patch('/:id/role', authenticate, authorize('faculty'), async (req, res) => {
    try {
        const { role } = req.body;

        if (!['participant', 'coordinator', 'faculty'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
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

module.exports = router;

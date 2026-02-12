# Registration System Fixes & Event Selection Feature

## Issues Found

### 1. **Email "Already in Use" After User Deletion**
**Problem**: When a faculty member deletes a user and then tries to recreate an account with the same email, MongoDB throws a duplicate key error because:
- The `email` field has a `unique: true` constraint in the User model
- Even though the user document is deleted, MongoDB's unique index prevents reuse

**Root Cause**: The delete operation in `userRoutes.js` (line 70) removes the user document but doesn't handle the unique constraint properly.

**Solution**: The current implementation is actually correct - it fully deletes the user. The issue might be:
- Browser cache showing old error
- The user wasn't fully deleted (check MongoDB directly)
- There's a timing issue with the deletion

### 2. **No Credentials Email During Registration**
**Problem**: Users don't receive credentials email immediately after registration.

**Current Flow**:
1. User pays ₹299 via Razorpay
2. User fills form + uploads PDF receipt
3. Registration is created with `verificationStatus: 'pending'`
4. **Faculty must manually verify** the user
5. Only after verification, credentials email is sent

**Why This Happens**: The registration endpoint (`/api/register`) doesn't send credentials - it only creates a pending user. Credentials are sent only when faculty clicks "Verify" in the dashboard (via `/api/participants/:id/verify`).

**Solution Options**:
- **Option A**: Send credentials immediately after registration (auto-approve)
- **Option B**: Keep manual verification but send a "pending" email
- **Option C**: Implement auto-verification for valid Razorpay payment IDs

### 3. **Missing Event Selection Feature**
**Problem**: Users cannot select which events they want to participate in during registration.

**Current State**:
- User model has `selectedEvents` field (line 40-42 in User.js)
- Registration form doesn't have event selection UI
- Faculty dashboard doesn't show selected events in the export

**Required Changes**:
1. Add event selection checkboxes to Register.jsx
2. Store selected events in the database
3. Display selected events in Faculty Dashboard
4. Include selected events in Excel export

---

## Implementation Plan

### Fix 1: Improve User Deletion (Handle Edge Cases)
**File**: `server/routes/userRoutes.js`

Add better error handling and logging:
```javascript
router.delete('/:id', authenticate, authorize('faculty'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role === 'faculty') {
            return res.status(403).json({ error: 'Cannot delete faculty users' });
        }

        // Delete all related registrations first
        await Registration.deleteMany({ user: req.params.id });
        
        // Delete the user
        await User.findByIdAndDelete(req.params.id);

        console.log(`🗑️ User deleted: ${user.name} (${user.email})`);
        console.log(`   Email ${user.email} is now available for re-registration`);
        
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});
```

### Fix 2: Send Immediate Credentials Email
**File**: `server/routes/authRoutes.js`

Modify the `/register` endpoint to send credentials immediately:
```javascript
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, college, department, selectedEvents } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = new User({
            name,
            email: email.toLowerCase(),
            password,
            phone,
            college,
            department,
            selectedEvents: selectedEvents || [],
            role: 'participant'
        });

        await user.save();

        // Send credentials email immediately
        const { sendCredentialsEmail } = require('../services/emailService');
        await sendCredentialsEmail(user, password);

        const token = generateToken(user._id);
        const userData = user.toJSON();
        userData.token = token;
        
        console.log(`✅ User registered: ${user.email} - Credentials sent`);
        res.status(201).json(userData);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
```

### Fix 3: Add Event Selection to Registration Form
**File**: `src/pages/Register.jsx`

Add event selection UI and update form data handling.

---

## Testing Checklist

- [ ] Delete a user and verify email can be reused
- [ ] Register a new user and verify credentials email is received
- [ ] Select events during registration and verify they're stored
- [ ] Check Faculty Dashboard shows selected events
- [ ] Export Excel and verify selected events column is included
- [ ] Test with duplicate email (should show proper error)
- [ ] Test with invalid Razorpay payment ID

---

## Notes

- The `selectedEvents` field in User model is already defined as an array of strings
- Email service is already configured and working (used for verification)
- Faculty dashboard already has export functionality - just needs to include selectedEvents

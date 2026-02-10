const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const User = require('../models/User');
const { generatePassword, sendCredentialsEmail } = require('../services/emailService');

// Configure multer for PDF uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/receipts');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

/**
 * POST /api/verify-payment
 * Verify payment by extracting text from PDF receipt and validating payment ID
 */
router.post('/verify-payment', upload.single('pdfReceipt'), async (req, res) => {
    try {
        const { paymentId, userId } = req.body;
        const pdfFile = req.file;

        // Validation: Check required fields
        if (!paymentId || !pdfFile || !userId) {
            return res.status(400).json({
                error: 'Please provide both payment ID and PDF receipt.'
            });
        }

        console.log(`📄 Payment verification request: ${paymentId} for user ${userId}`);

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Check if user is already approved
        if (user.verificationStatus === 'approved') {
            return res.status(400).json({
                error: 'Your account is already verified.'
            });
        }

        // STEP 1: Check for duplicate payment ID in database
        const existingUser = await User.findOne({ razorpayPaymentId: paymentId });
        if (existingUser) {
            console.warn(`⚠️ Duplicate payment ID attempt: ${paymentId}`);
            return res.status(400).json({
                error: 'This payment ID has already been used for registration. Please contact support if you believe this is an error.'
            });
        }

        // STEP 2: Extract text from PDF
        let pdfText = '';
        try {
            const dataBuffer = fs.readFileSync(pdfFile.path);
            const pdfData = await pdfParse(dataBuffer);
            pdfText = pdfData.text;
            console.log(`📝 PDF text extracted (${pdfText.length} characters)`);
        } catch (pdfError) {
            console.error('PDF parsing error:', pdfError);
            return res.status(400).json({
                error: 'Unable to read PDF. Please ensure you uploaded a valid PDF receipt from Razorpay.'
            });
        }

        // STEP 3: Validate that payment ID exists in PDF text
        const paymentIdRegex = new RegExp(paymentId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); // Escape special chars, case insensitive
        if (!paymentIdRegex.test(pdfText)) {
            console.warn(`❌ Payment ID not found in PDF: ${paymentId}`);
            return res.status(400).json({
                error: 'Payment ID not found in the uploaded PDF. Please verify the payment ID and try again.'
            });
        }

        // STEP 4: All validations passed - Auto-approve user
        const password = generatePassword();

        user.razorpayPaymentId = paymentId;
        user.verificationStatus = 'approved';
        user.paymentStatus = 'completed';
        user.password = password;
        user.verifiedAt = new Date();
        user.paymentScreenshot = `/uploads/receipts/${pdfFile.filename}`; // Store PDF path

        await user.save();

        // STEP 5: Send credentials email
        const emailSent = await sendCredentialsEmail(user, password);

        console.log(`✅ User auto-approved: ${user.name} (${user.email})`);
        console.log(`📧 Credentials email sent: ${emailSent}`);

        res.json({
            success: true,
            message: 'Payment verified successfully! Check your email for login credentials.',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                verificationStatus: user.verificationStatus
            }
        });

    } catch (error) {
        console.error('❌ Payment verification error:', error);
        res.status(500).json({
            error: 'Payment verification failed. Please try again or contact support.'
        });
    }
});

module.exports = router;

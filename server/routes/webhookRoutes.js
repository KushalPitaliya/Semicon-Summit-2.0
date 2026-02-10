const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const { generatePassword, sendCredentialsEmail } = require('../services/emailService');

/**
 * Razorpay Webhook Handler
 * Receives payment confirmation from Razorpay and auto-approves users
 * 
 * Webhook Event: payment.captured
 * Documentation: https://razorpay.com/docs/webhooks/
 */
router.post('/razorpay', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        // Parse the webhook payload
        const payload = JSON.parse(req.body.toString());

        console.log('📥 Razorpay webhook received:', payload.event);

        // Verify webhook signature for security (if secret is configured)
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (webhookSecret) {
            const signature = req.headers['x-razorpay-signature'];
            const expectedSignature = crypto
                .createHmac('sha256', webhookSecret)
                .update(req.body.toString())
                .digest('hex');

            if (signature !== expectedSignature) {
                console.error('❌ Invalid webhook signature');
                return res.status(400).json({ error: 'Invalid signature' });
            }
        }

        // Handle payment.captured event
        if (payload.event === 'payment.captured' || payload.event === 'payment.authorized') {
            const payment = payload.payload.payment.entity;

            const paymentId = payment.id;
            const amount = payment.amount; // Amount in paise
            const email = payment.email;
            const contact = payment.contact;
            const status = payment.status;

            console.log(`💰 Payment ${status}: ${paymentId} | ${email} | ₹${amount / 100}`);

            // Find pending user by email or phone
            const user = await User.findOne({
                $or: [
                    { email: email?.toLowerCase() },
                    { phone: contact }
                ],
                verificationStatus: 'pending'
            });

            if (!user) {
                console.warn(`⚠️ No pending user found for email: ${email} or phone: ${contact}`);
                // Still return 200 to acknowledge webhook
                return res.status(200).json({
                    received: true,
                    message: 'No matching pending user found'
                });
            }

            // Check if payment already processed
            if (user.razorpayPaymentId === paymentId) {
                console.log(`⚠️ Payment ${paymentId} already processed for user ${user.email}`);
                return res.status(200).json({ received: true, message: 'Already processed' });
            }

            // Auto-approve user
            const password = generatePassword();

            user.password = password;
            user.verificationStatus = 'approved';
            user.paymentStatus = 'completed';
            user.razorpayPaymentId = paymentId;
            user.razorpayOrderId = payment.order_id || null;
            user.paymentAmount = amount / 100; // Convert paise to rupees
            user.verifiedAt = new Date();

            await user.save();

            // Send credentials email
            const emailSent = await sendCredentialsEmail(user, password);

            console.log(`✅ User auto-approved: ${user.name} (${user.email})`);
            console.log(`📧 Credentials email sent: ${emailSent}`);

            return res.status(200).json({
                received: true,
                message: 'User approved and credentials sent',
                userId: user._id
            });
        }

        // Handle payment.failed event
        if (payload.event === 'payment.failed') {
            const payment = payload.payload.payment.entity;
            console.log(`❌ Payment failed: ${payment.id} | ${payment.email}`);

            // Optionally: Send payment failure notification
            // You can implement this later if needed
        }

        // Acknowledge all other events
        res.status(200).json({ received: true });

    } catch (error) {
        console.error('❌ Webhook processing error:', error);
        // Return 200 even on error to prevent Razorpay from retrying
        // Log the error for manual investigation
        res.status(200).json({ received: true, error: error.message });
    }
});

module.exports = router;

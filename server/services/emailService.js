const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Generate random password
const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

// Send credentials email
const sendCredentialsEmail = async (user, password) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"Semiconductor Summit 2.0" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: '✅ Registration Approved - Your Login Credentials',
        html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a0f; color: #ffffff; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #111118 0%, #1a1a24 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(34, 211, 238, 0.2); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: 700; background: linear-gradient(135deg, #3b82f6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .badge { display: inline-block; background: rgba(34, 197, 94, 0.2); color: #4ade80; padding: 8px 16px; border-radius: 20px; font-size: 14px; margin-top: 10px; }
        .greeting { font-size: 18px; color: #a1a1aa; margin-bottom: 20px; }
        .credentials-box { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 24px; margin: 24px 0; }
        .credential-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .credential-row:last-child { border-bottom: none; }
        .credential-label { color: #71717a; font-size: 14px; }
        .credential-value { color: #22d3ee; font-weight: 600; font-family: monospace; font-size: 16px; }
        .events-section { margin-top: 24px; }
        .event-tag { display: inline-block; background: rgba(139, 92, 246, 0.2); color: #a78bfa; padding: 6px 12px; border-radius: 6px; margin: 4px; font-size: 13px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; margin-top: 24px; }
        .footer { text-align: center; margin-top: 30px; color: #52525b; font-size: 13px; }
        .warning { background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 8px; padding: 12px; margin-top: 20px; color: #fbbf24; font-size: 13px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">⚡ Semiconductor Summit 2.0</div>
            <div class="badge">✓ Payment Verified</div>
        </div>
        
        <p class="greeting">Hello ${user.name},</p>
        
        <p style="color: #a1a1aa; line-height: 1.6;">
            Great news! Your registration payment has been verified. Here are your login credentials:
        </p>
        
        <div class="credentials-box">
            <div class="credential-row">
                <span class="credential-label">Email (Username)</span>
                <span class="credential-value">${user.email}</span>
            </div>
            <div class="credential-row">
                <span class="credential-label">Password</span>
                <span class="credential-value">${password}</span>
            </div>
        </div>
        
        <div class="events-section">
            <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 10px;">Registered Events:</p>
            ${user.selectedEvents?.map(event => `<span class="event-tag">${event}</span>`).join('') || '<span class="event-tag">All Events</span>'}
        </div>
        
        <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="cta-button">
                Login to Dashboard →
            </a>
        </div>
        
        <div class="warning">
            ⚠️ Please change your password after first login for security.
        </div>
        
        <div class="footer">
            <p>If you have any questions, contact us at the event.</p>
            <p>© 2026 Semiconductor Summit 2.0</p>
        </div>
    </div>
</body>
</html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Credentials email sent to ${user.email}`);
        return true;
    } catch (error) {
        console.error(`❌ Email sending failed:`, error.message);
        return false;
    }
};

// Send rejection email
const sendRejectionEmail = async (user, reason) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"Semiconductor Summit 2.0" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: '❌ Registration Payment Issue - Action Required',
        html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a0f; color: #ffffff; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #111118 0%, #1a1a24 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(239, 68, 68, 0.2); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: 700; color: #ef4444; }
        .badge { display: inline-block; background: rgba(239, 68, 68, 0.2); color: #f87171; padding: 8px 16px; border-radius: 20px; font-size: 14px; margin-top: 10px; }
        .reason-box { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 20px; margin: 24px 0; }
        .footer { text-align: center; margin-top: 30px; color: #52525b; font-size: 13px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">⚠️ Payment Verification Issue</div>
            <div class="badge">Action Required</div>
        </div>
        
        <p style="color: #a1a1aa; line-height: 1.6;">
            Hello ${user.name},
        </p>
        
        <p style="color: #a1a1aa; line-height: 1.6;">
            Unfortunately, we couldn't verify your payment for the Semiconductor Summit 2.0. 
        </p>
        
        <div class="reason-box">
            <p style="color: #f87171; font-weight: 600; margin-bottom: 8px;">Reason:</p>
            <p style="color: #fca5a5;">${reason || 'Payment details could not be verified. Please contact support.'}</p>
        </div>
        
        <p style="color: #a1a1aa; line-height: 1.6;">
            Please re-register with correct payment details or contact the organizers for assistance.
        </p>
        
        <div class="footer">
            <p>© 2026 Semiconductor Summit 2.0</p>
        </div>
    </div>
</body>
</html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Rejection email sent to ${user.email}`);
        return true;
    } catch (error) {
        console.error(`❌ Email sending failed:`, error.message);
        return false;
    }
};

// Send password reset email
const sendPasswordResetEmail = async (user, newPassword) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"Semiconductor Summit 2.0" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: '🔐 Password Reset - Your New Login Credentials',
        html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a0f; color: #ffffff; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #111118 0%, #1a1a24 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(16, 185, 129, 0.2); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: 700; background: linear-gradient(135deg, #10b981, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .badge { display: inline-block; background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 8px 16px; border-radius: 20px; font-size: 14px; margin-top: 10px; }
        .credentials-box { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 24px; margin: 24px 0; }
        .credential-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .credential-row:last-child { border-bottom: none; }
        .credential-label { color: #71717a; font-size: 14px; }
        .credential-value { color: #34d399; font-weight: 600; font-family: monospace; font-size: 16px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; margin-top: 24px; }
        .footer { text-align: center; margin-top: 30px; color: #52525b; font-size: 13px; }
        .warning { background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 8px; padding: 12px; margin-top: 20px; color: #fbbf24; font-size: 13px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🔐 Password Reset</div>
            <div class="badge">Semiconductor Summit 2.0</div>
        </div>
        
        <p style="color: #a1a1aa; line-height: 1.6;">
            Hello ${user.name},
        </p>
        
        <p style="color: #a1a1aa; line-height: 1.6;">
            Your password has been reset by an administrator. Here are your new login credentials:
        </p>
        
        <div class="credentials-box">
            <div class="credential-row">
                <span class="credential-label">Email (Username)</span>
                <span class="credential-value">${user.email}</span>
            </div>
            <div class="credential-row">
                <span class="credential-label">New Password</span>
                <span class="credential-value">${newPassword}</span>
            </div>
        </div>
        
        <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="cta-button">
                Login Now →
            </a>
        </div>
        
        <div class="warning">
            ⚠️ Please change your password after logging in for security.
        </div>
        
        <div class="footer">
            <p>If you didn't request this reset, please contact the organizers immediately.</p>
            <p>© 2026 Semiconductor Summit 2.0</p>
        </div>
    </div>
</body>
</html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Password reset email sent to ${user.email}`);
        return true;
    } catch (error) {
        console.error(`❌ Password reset email failed:`, error.message);
        return false;
    }
};

module.exports = {
    generatePassword,
    sendCredentialsEmail,
    sendRejectionEmail,
    sendPasswordResetEmail
};

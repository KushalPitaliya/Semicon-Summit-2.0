/**
 * ===========================================
 * SEMICONDUCTOR SUMMIT 2.0 - GOOGLE APPS SCRIPT
 * ===========================================
 * 
 * This script handles:
 * 1. Auto-generation of login credentials (username = email, password = random)
 * 2. Storing credentials in the Google Sheet
 * 3. Sending two emails to the user:
 *    - Email 1: Login credentials
 *    - Email 2: Registration confirmation
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet (linked to the Form)
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire script
 * 4. Update the CONFIG section below with your details
 * 5. Save and run the 'createTrigger' function once to set up the form trigger
 * 6. Authorize the script when prompted
 */

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================
const CONFIG = {
  // Your summit details
  SUMMIT_NAME: 'Semiconductor Summit 2.0',
  SUMMIT_DATE: 'Coming Soon 2026', // Update with actual date
  SUMMIT_VENUE: 'Your College Name, City', // Update with actual venue
  
  // Contact information
  CONTACT_EMAIL: 'semisummit.ec@charusat.ac.in',
  CONTACT_PHONE: '+91 98765 43210',
  
  // Website URLs
  WEBSITE_URL: 'https://your-website-url.com',
  LOGIN_URL: 'https://your-website-url.com/login',
  
  // Column indices in the Google Sheet (1-indexed)
  COLUMNS: {
    TIMESTAMP: 1,
    NAME: 2,
    EMAIL: 3,
    COLLEGE: 4,
    PHONE: 5,
    EVENTS: 6,
    PAYMENT_REF: 7,
    PAYMENT_SCREENSHOT: 8,
    USERNAME: 9,    // Will be auto-filled
    PASSWORD: 10,   // Will be auto-filled
    ROLE: 11,       // Will be auto-filled (default: participant)
    EMAIL_SENT: 12  // Will be auto-filled (Yes/No)
  }
};

// ============================================
// MAIN TRIGGER FUNCTION
// ============================================

/**
 * This function is triggered when a new form response is submitted
 * It generates credentials, stores them, and sends emails
 */
function onFormSubmit(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    // Get form response data
    const name = sheet.getRange(lastRow, CONFIG.COLUMNS.NAME).getValue();
    const email = sheet.getRange(lastRow, CONFIG.COLUMNS.EMAIL).getValue();
    const college = sheet.getRange(lastRow, CONFIG.COLUMNS.COLLEGE).getValue();
    const events = sheet.getRange(lastRow, CONFIG.COLUMNS.EVENTS).getValue();
    
    // Generate credentials
    const username = email.toLowerCase().trim();
    const password = generatePassword(8);
    
    // Store credentials in the sheet
    sheet.getRange(lastRow, CONFIG.COLUMNS.USERNAME).setValue(username);
    sheet.getRange(lastRow, CONFIG.COLUMNS.PASSWORD).setValue(password);
    sheet.getRange(lastRow, CONFIG.COLUMNS.ROLE).setValue('participant');
    
    // Send emails
    sendCredentialsEmail(email, name, username, password);
    sendConfirmationEmail(email, name, events, college);
    
    // Mark email as sent
    sheet.getRange(lastRow, CONFIG.COLUMNS.EMAIL_SENT).setValue('Yes');
    
    Logger.log(`Successfully processed registration for ${email}`);
    
  } catch (error) {
    Logger.log('Error in onFormSubmit: ' + error.toString());
    
    // Mark email as failed
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, CONFIG.COLUMNS.EMAIL_SENT).setValue('Error: ' + error.toString());
  }
}

// ============================================
// PASSWORD GENERATION
// ============================================

/**
 * Generates a random alphanumeric password
 * @param {number} length - Length of the password
 * @returns {string} - Generated password
 */
function generatePassword(length) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// ============================================
// EMAIL FUNCTIONS
// ============================================

/**
 * Sends Email 1: Login credentials
 */
function sendCredentialsEmail(email, name, username, password) {
  const subject = `🔐 Your ${CONFIG.SUMMIT_NAME} Login Credentials`;
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
    .credentials { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0; }
    .credential-row { display: flex; margin: 10px 0; }
    .credential-label { font-weight: 600; width: 100px; color: #6b7280; }
    .credential-value { font-family: monospace; background: #f3f4f6; padding: 4px 12px; border-radius: 4px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">${CONFIG.SUMMIT_NAME}</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Login Credentials</p>
    </div>
    <div class="content">
      <p>Hello <strong>${name}</strong>,</p>
      <p>Thank you for registering for ${CONFIG.SUMMIT_NAME}! Your account has been created successfully.</p>
      
      <div class="credentials">
        <h3 style="margin-top: 0; color: #1f2937;">Your Login Details</h3>
        <p><strong>Username:</strong> <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${username}</code></p>
        <p><strong>Password:</strong> <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${password}</code></p>
      </div>
      
      <p>Please keep these credentials safe. You'll need them to access your participant dashboard.</p>
      
      <a href="${CONFIG.LOGIN_URL}" class="btn">Login to Dashboard</a>
      
      <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
        If you have any questions, please contact us at <a href="mailto:${CONFIG.CONTACT_EMAIL}">${CONFIG.CONTACT_EMAIL}</a>
      </p>
    </div>
    <div class="footer">
      <p>&copy; 2026 ${CONFIG.SUMMIT_NAME}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
  
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody
  });
}

/**
 * Sends Email 2: Registration confirmation with event details
 */
function sendConfirmationEmail(email, name, events, college) {
  const subject = `✅ Registration Confirmed - ${CONFIG.SUMMIT_NAME}`;
  
  // Parse events if it's a comma-separated string
  const eventsList = typeof events === 'string' 
    ? events.split(',').map(e => e.trim()).filter(e => e)
    : [events];
  
  const eventsHtml = eventsList.map(event => `<li>${event}</li>`).join('');
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
    .info-box { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0; }
    .events-list { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0; }
    .events-list ul { margin: 10px 0; padding-left: 20px; }
    .events-list li { margin: 8px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    .highlight { background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); padding: 15px; border-radius: 8px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">${CONFIG.SUMMIT_NAME}</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Registration Confirmed! 🎉</p>
    </div>
    <div class="content">
      <p>Hello <strong>${name}</strong>,</p>
      <p>We're thrilled to confirm your registration for ${CONFIG.SUMMIT_NAME}!</p>
      
      <div class="events-list">
        <h3 style="margin-top: 0; color: #1f2937;">📋 Events You've Registered For</h3>
        <ul>
          ${eventsHtml}
        </ul>
      </div>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #1f2937;">📍 Summit Details</h3>
        <p><strong>Date:</strong> ${CONFIG.SUMMIT_DATE}</p>
        <p><strong>Venue:</strong> ${CONFIG.SUMMIT_VENUE}</p>
        <p><strong>College:</strong> ${college}</p>
      </div>
      
      <div class="highlight">
        <p style="margin: 0; font-weight: 600;">
          We can't wait to see you at the summit! 🚀
        </p>
      </div>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #1f2937;">📞 Contact Information</h3>
        <p><strong>Email:</strong> <a href="mailto:${CONFIG.CONTACT_EMAIL}">${CONFIG.CONTACT_EMAIL}</a></p>
        <p><strong>Phone:</strong> ${CONFIG.CONTACT_PHONE}</p>
        <p><strong>Website:</strong> <a href="${CONFIG.WEBSITE_URL}">${CONFIG.WEBSITE_URL}</a></p>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        Keep an eye on your inbox for more updates and announcements!
      </p>
    </div>
    <div class="footer">
      <p>&copy; 2026 ${CONFIG.SUMMIT_NAME}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
  
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody
  });
}

// ============================================
// SETUP FUNCTIONS
// ============================================

/**
 * Run this function ONCE to create the form submit trigger
 * Go to Run > Run function > createTrigger
 */
function createTrigger() {
  // Delete any existing triggers first
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'onFormSubmit') {
      ScriptApp.deleteTrigger(trigger);
    }
  }
  
  // Create new trigger
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onFormSubmit()
    .create();
  
  Logger.log('Form submit trigger created successfully!');
}

/**
 * Adds header row to the sheet with all required columns
 * Run this once to set up your sheet structure
 */
function setupSheetHeaders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headers = [
    'Timestamp',
    'Full Name',
    'Email',
    'College',
    'Phone',
    'Events Selected',
    'Payment Reference',
    'Payment Screenshot',
    'Username',
    'Password',
    'Role',
    'Email Sent'
  ];
  
  // Set headers in first row
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f3f4f6');
  
  Logger.log('Sheet headers set up successfully!');
}

/**
 * Test function to verify email sending works
 * Update TEST_EMAIL before running
 */
function testEmailSending() {
  const TEST_EMAIL = 'your-test-email@example.com'; // UPDATE THIS
  const TEST_NAME = 'Test User';
  const TEST_USERNAME = 'test@example.com';
  const TEST_PASSWORD = 'TestPass123';
  const TEST_EVENTS = 'VLSI Design Workshop, Chip Architecture Talk';
  const TEST_COLLEGE = 'Test University';
  
  try {
    sendCredentialsEmail(TEST_EMAIL, TEST_NAME, TEST_USERNAME, TEST_PASSWORD);
    sendConfirmationEmail(TEST_EMAIL, TEST_NAME, TEST_EVENTS, TEST_COLLEGE);
    Logger.log('Test emails sent successfully to ' + TEST_EMAIL);
  } catch (error) {
    Logger.log('Error sending test emails: ' + error.toString());
  }
}

// ============================================
// API FUNCTIONS (for website integration)
// ============================================

/**
 * Web API endpoint for login validation
 * Deploy as Web App to use this
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === 'login') {
      return handleLogin(data.email, data.password);
    }
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: 'Unknown action' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleLogin(email, password) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const rowEmail = data[i][CONFIG.COLUMNS.EMAIL - 1];
    const rowPassword = data[i][CONFIG.COLUMNS.PASSWORD - 1];
    const rowRole = data[i][CONFIG.COLUMNS.ROLE - 1];
    const rowName = data[i][CONFIG.COLUMNS.NAME - 1];
    const rowCollege = data[i][CONFIG.COLUMNS.COLLEGE - 1];
    const rowPhone = data[i][CONFIG.COLUMNS.PHONE - 1];
    const rowEvents = data[i][CONFIG.COLUMNS.EVENTS - 1];
    
    if (rowEmail.toLowerCase().trim() === email.toLowerCase().trim() && rowPassword === password) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          user: {
            name: rowName,
            email: rowEmail,
            role: rowRole || 'participant',
            college: rowCollege,
            phone: rowPhone,
            events: rowEvents.split(',').map(e => e.trim())
          }
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(
    JSON.stringify({ success: false, error: 'Invalid email or password' })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Get all participants (for Faculty dashboard)
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'getParticipants') {
      return getParticipants();
    }
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: 'Unknown action' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function getParticipants() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  const participants = [];
  
  // Skip header row
  for (let i = 1; i < data.length; i++) {
    participants.push({
      id: i,
      name: data[i][CONFIG.COLUMNS.NAME - 1],
      email: data[i][CONFIG.COLUMNS.EMAIL - 1],
      college: data[i][CONFIG.COLUMNS.COLLEGE - 1],
      phone: data[i][CONFIG.COLUMNS.PHONE - 1],
      events: data[i][CONFIG.COLUMNS.EVENTS - 1],
      paymentRef: data[i][CONFIG.COLUMNS.PAYMENT_REF - 1],
      timestamp: data[i][CONFIG.COLUMNS.TIMESTAMP - 1]
    });
  }
  
  return ContentService.createTextOutput(
    JSON.stringify({ success: true, participants: participants })
  ).setMimeType(ContentService.MimeType.JSON);
}

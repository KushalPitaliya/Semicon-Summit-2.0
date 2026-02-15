# Faculty User Credentials

## Current Faculty Accounts in System

### Faculty Account 1
- **Name:** Dr. Rajesh Kumar
- **Email:** `faculty@demo.com`
- **Password:** `demo123`
- **Role:** Faculty (Admin Access)
- **College:** Indian Institute of Technology
- **Department:** Electronics Engineering
- **Status:** Approved

### Faculty Account 2
- **Name:** Prof. Anita Sharma
- **Email:** `faculty2@demo.com`
- **Password:** `demo123`
- **Role:** Faculty (Admin Access)
- **College:** National Institute of Technology
- **Department:** VLSI Design
- **Status:** Approved

---

## Coordinator Accounts (Also have admin-like access)

### Coordinator Account 1
- **Name:** Priya Coordinator
- **Email:** `coordinator@demo.com`
- **Password:** `demo123`
- **Role:** Coordinator
- **College:** VIT University
- **Department:** Electronics and Communication

### Coordinator Account 2
- **Name:** Rahul Coordinator
- **Email:** `coordinator2@demo.com`
- **Password:** `demo123`
- **Role:** Coordinator
- **College:** SRM University
- **Department:** Electronics

---

## Important Notes

### ⚠️ Before Going Live

1. **Delete all test/demo accounts** using the provided script:
   ```bash
   cd server
   node scripts/clearDatabase.js
   ```
   This will safely delete ALL data from the database.

2. **Change default passwords** immediately after going live

3. **Create new faculty accounts** with strong passwords:
   - Use the Faculty Dashboard registration flow
   - Or manually create accounts with secure credentials

### 🔒 Security Recommendations

1. **Never use `demo123` in production**
2. **Use strong passwords** (minimum 12 characters, mix of letters, numbers, symbols)
3. **Consider implementing 2FA** for faculty accounts
4. **Regularly rotate passwords** every 90 days
5. **Use environment variables** for sensitive data

### 📝 Creating New Faculty Accounts

After clearing the database, you have two options:

#### Option 1: Via Registration (Recommended for Production)
1. New faculty members register through the website
2. Admin approves their registration
3. System sends login credentials via email

#### Option 2: Via Database Seeding (For Development)
1. Update `server/seeders/seed.js` with new faculty data
2. Run: `node seeders/seed.js --fresh --users`

### 🚀 Production Deployment Checklist

- [ ] Clear database using `clearDatabase.js` script
- [ ] Remove all demo/test accounts
- [ ] Change all default passwords
- [ ] Verify email service is working (for sending credentials)
- [ ] Test the complete registration → approval → login flow
- [ ] Update rate limits if needed (currently 20 auth attempts per 15 min)
- [ ] Monitor server logs for any issues
- [ ] Set up backup strategy for production data

---

## How to Clear the Database

```bash
# Navigate to server directory
cd server

# Run the clear database script
node scripts/clearDatabase.js

# The script will:
# 1. Show current database counts
# 2. Ask for confirmation (type "DELETE")
# 3. Delete all users, registrations, gallery, announcements, events
# 4. Confirm completion

# After clearing, your database is ready for production registrations!
```

---

## Contact for Access Issues

If faculty members have trouble logging in:
1. Check their verification status in Faculty Dashboard
2. Verify email credentials were sent
3. Reset password via "Forgot Password" link
4. Check rate limiting (HTTP 429 errors mean too many attempts)

---

**Created:** February 15, 2026  
**Last Updated:** February 15, 2026

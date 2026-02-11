# 🚀 Quick Start Guide - Get Server Running

## ❌ Current Issue
```
sh: nodemon: command not found
Error: Cannot find module 'dotenv'
```

**Cause**: Dependencies not installed due to macOS Desktop folder permissions

---

## ✅ **Solution: 3-Step Fix**

### **Step 1: Grant Terminal Full Disk Access**

1. Open **System Settings** (⚙️ in Dock)
2. Click **Privacy & Security**
3. Scroll down to **Full Disk Access**
4. Click the **🔒 lock** and enter your password
5. Click **+** button
6. Navigate to **Applications** → **Utilities** → **Terminal**
7. Select **Terminal** and click **Open**
8. **IMPORTANT**: Quit and restart Terminal completely

---

### **Step 2: Install Server Dependencies**

Open a **NEW** Terminal window and run:

```bash
cd /Users/kushalpitaliya/Desktop/Semicon_summit2.0/server
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Expected output**:
```
added 150 packages in 45s
```

---

### **Step 3: Install Frontend Dependencies**

```bash
cd /Users/kushalpitaliya/Desktop/Semicon_summit2.0
rm -rf node_modules package-lock.json  
npm cache clean --force
npm install
```

**Expected output**:
```
added 200 packages in 30s
```

---

## 🎯 **Alternative: Use Automated Script**

If the above doesn't work, run:

```bash
cd /Users/kushalpitaliya/Desktop/Semicon_summit2.0
./setup-everything.sh
```

---

## 🚀 **Running the Application**

Once dependencies are installed:

### **Terminal 1: Backend Server**
```bash
cd /Users/kushalpitaliya/Desktop/Semicon_summit2.0/server
npm start
```

**Expected**: 
```
✅ Connected to MongoDB
🚀 Server running on port 3001
```

### **Terminal 2: Frontend (in a NEW terminal)**
```bash
cd /Users/kushalpitaliya/Desktop/Semicon_summit2.0
npm run dev
```

**Expected**:
```
  VITE v7.2.4  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### **Browser**
Open: **http://localhost:5173/glimpses**

---

## 🐛 **If Still Getting Errors**

### **Error: Operation not permitted**
Solution: Complete Step 1 above and **restart Terminal**

### **Error: EPERM or EACCES**
```bash
# Fix npm ownership
chown -R $(whoami) ~/.npm
```

### **Error: Port already in use**
```bash
# Kill processes on ports
lsof -ti:3001 | xargs kill  # Backend
lsof -ti:5173 | xargs kill  # Frontend
```

### **Error: Cannot find module**
```bash
# Reinstall from scratch
cd server
rm -rf node_modules package-lock.json ~/.npm
npm install

cd ..
rm -rf node_modules package-lock.json
npm install
```

---

## 📋 **Quick Reference Commands**

| Task | Command |
|------|---------|
| Install server deps | `cd server && npm install` |
| Install frontend deps | `npm install` |
| Start backend | `cd server && npm start` |
| Start frontend | `npm run dev` |
| View glimpses | Open `http://localhost:5173/glimpses` |
| Stop servers | Press `Ctrl+C` in each terminal |

---

## ✅ **Verification Checklist**

Before starting servers, verify:

- [ ] Terminal has Full Disk Access (System Settings)
- [ ] Terminal has been restarted
- [ ] `server/node_modules/` folder exists
- [ ] Root `node_modules/` folder exists
- [ ] `.env` file exists in `server/` folder
- [ ] MongoDB URI is configured

---

## 🎯 **Expected File Structure**

```
Semicon_summit2.0/
├── server/
│   ├── node_modules/        ← Should exist after install
│   ├── package.json
│   ├── index.js
│   └── .env                 ← MongoDB config
│
├── src/
│   ├── pages/
│   │   ├── Glimpses.jsx     ← New gallery page
│   │   └── Glimpses.css     ← Gallery styles
│   └── App.jsx              ← Route added
│
├── public/
│   └── images/
│       └── Glimps/          ← Your 16 photos
│
├── node_modules/             ← Should exist after install
└── package.json
```

---

## 🎉 **Success Indicators**

You'll know it's working when:

1. ✅ No errors during `npm install`
2. ✅ Backend shows "Connected to MongoDB"
3. ✅ Frontend shows Vite dev server URL
4. ✅ Browser loads without errors
5. ✅ Glimpses page shows your 16 photos

---

## 💡 **Pro Tips**

1. **Always use 2 terminals**: One for backend, one for frontend
2. **Check .env**: Ensure MongoDB URI is correct
3. **Clear cache**: If issues persist, run `npm cache clean --force`
4. **Restart Terminal**: After granting Full Disk Access
5. **Use npm start**: If nodemon isn't working

---

## 📞 **Still Stuck?**

Try these in order:

1. **Restart your Mac** (sometimes needed for permissions)
2. **Move project out of Desktop**:
   ```bash
   mv ~/Desktop/Semicon_summit2.0 ~/Documents/
   cd ~/Documents/Semicon_summit2.0
   ```
3. **Use a different folder**: Desktop has strict permissions on macOS

---

**Once running, visit: http://localhost:5173/glimpses to see your beautiful gallery! 🎉**

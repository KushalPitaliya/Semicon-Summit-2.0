#!/bin/bash

# ========================================
# MacOS Permissions Fix + Dependencies Install
# ========================================

echo "🔧 Fixing MacOS Permissions and Installing Dependencies"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}📋 STEP 1: Grant Terminal Full Disk Access${NC}"
echo ""
echo "Please follow these steps manually:"
echo "1. Open System Settings (or System Preferences)"
echo "2. Go to Privacy & Security → Full Disk Access"
echo "3. Click the 🔒 lock icon and enter your password"
echo "4. Click + and add Terminal.app"
echo "5. Restart Terminal"
echo ""
read -p "Press Enter AFTER you've completed these steps..."

echo ""
echo -e "${GREEN}✅ Great! Now let's fix npm cache...${NC}"
echo ""

# Fix npm cache ownership
echo "Fixing npm cache permissions..."
chown -R $(whoami) ~/.npm 2>/dev/null || echo "Skip if error..."

echo ""
echo -e "${GREEN}📦 Installing Server Dependencies...${NC}"
cd "$(dirname "$0")/server"
rm -rf node_modules package-lock.json
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Server dependencies installed!${NC}"
else
    echo ""
    echo -e "${RED}❌ Server install failed. Try manually:${NC}"
    echo "  cd server"
    echo "  npm install"
fi

echo ""
echo -e "${GREEN}📦 Installing Frontend Dependencies...${NC}"
cd ..
rm -rf node_modules package-lock.json
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Frontend dependencies installed!${NC}"
else
    echo ""
    echo -e "${RED}❌ Frontend install failed. Try manually:${NC}"
    echo "  npm install"
fi

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "To start the servers:"
echo "  Terminal 1: cd server && npm start"
echo "  Terminal 2: npm run dev"
echo ""

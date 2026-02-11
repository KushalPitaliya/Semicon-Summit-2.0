#!/bin/bash

# ========================================
# Fix node_modules Permissions on macOS
# ========================================

echo "🔧 Fixing node_modules permissions issue..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}❌ This script is designed for macOS${NC}"
    exit 1
fi

echo -e "${YELLOW}Choose a solution:${NC}"
echo "1. Clean and reinstall server dependencies (Recommended)"
echo "2. Move project out of Desktop folder"
echo "3. Exit and manually grant Terminal Full Disk Access"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo -e "${GREEN}🧹 Cleaning server node_modules...${NC}"
        cd "$(dirname "$0")/server" || exit 1
        
        # Try to remove without sudo first
        if rm -rf node_modules package-lock.json 2>/dev/null; then
            echo -e "${GREEN}✅ Cleaned successfully${NC}"
        else
            echo -e "${YELLOW}⚠️  Need elevated permissions${NC}"
            echo "Please enter your password when prompted:"
            sudo rm -rf node_modules package-lock.json
        fi
        
        echo ""
        echo -e "${GREEN}📦 Installing dependencies...${NC}"
        npm install
        
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ Dependencies installed successfully!${NC}"
            echo ""
            echo "You can now run:"
            echo "  npm start        - Start the server"
            echo "  npm test         - Run tests"
        else
            echo -e "${RED}❌ Installation failed${NC}"
            echo "Try Option 3: Grant Terminal Full Disk Access"
        fi
        ;;
        
    2)
        echo -e "${GREEN}📁 Moving project to ~/Projects/${NC}"
        
        # Create Projects directory if it doesn't exist
        mkdir -p ~/Projects
        
        # Get current directory name
        PROJECT_DIR="$(basename "$(dirname "$0")")"
        
        # Move project
        mv "$(dirname "$0")" ~/Projects/
        
        echo -e "${GREEN}✅ Project moved to ~/Projects/${PROJECT_DIR}${NC}"
        echo ""
        echo "Now run:"
        echo "  cd ~/Projects/${PROJECT_DIR}/server"
        echo "  npm install"
        ;;
        
    3)
        echo ""
        echo -e "${YELLOW}📋 Manual steps to grant Full Disk Access:${NC}"
        echo ""
        echo "1. Open System Settings (or System Preferences)"
        echo "2. Go to Privacy & Security → Full Disk Access"
        echo "3. Click the lock icon and authenticate"
        echo "4. Click + and add your Terminal app"
        echo "5. Restart Terminal"
        echo ""
        echo "Then run:"
        echo "  cd server"
        echo "  rm -rf node_modules package-lock.json"
        echo "  npm install"
        echo ""
        ;;
        
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Done! 🎉${NC}"

# 🧪 Testing & Setup Guide - Semicon Summit 2.0

## 📋 Table of Contents
1. [Fixing node_modules Permissions Issue](#fix-permissions)
2. [Installing Test Dependencies](#install-dependencies)
3. [Running Backend Tests](#backend-tests)
4. [Running Frontend Tests](#frontend-tests)
5. [Test Coverage](#test-coverage)
6. [Continuous Integration](#ci)

---

## 🔧 1. Fixing node_modules Permissions Issue {#fix-permissions}

### Problem
macOS has strict permissions on Desktop folders, causing `EPERM: operation not permitted` errors.

### Solutions (Choose One)

#### **Option A: Grant Terminal Full Disk Access (Recommended)**
1. Open **System Settings** (or System Preferences)
2. Go to **Privacy & Security** → **Full Disk Access**
3. Click the **lock icon** and authenticate
4. Click **+** and add your **Terminal** app
5. Restart Terminal

Then run:
```bash
cd /Users/kushalpitaliya/Desktop/Semicon_summit2.0/server
rm -rf node_modules package-lock.json
npm install
```

#### **Option B: Move Project Outside Desktop**
```bash
# Move project to Documents or Home directory
mv /Users/kushalpitaliya/Desktop/Semicon_summit2.0 ~/Projects/Semicon_summit2.0
cd ~/Projects/Semicon_summit2.0/server
npm install
```

#### **Option C: Use Finder to Delete node_modules**
1. Open **Finder**
2. Navigate to `Desktop/Semicon_summit2.0/server`
3. **Right-click** on `node_modules` folder
4. Select **Move to Trash**
5. Empty trash
6. Then run: `npm install`

---

## 📦 2. Installing Test Dependencies {#install-dependencies}

### Backend (Jest + Supertest)
```bash
cd server
npm install --save-dev jest supertest
```

### Frontend (Vitest + React Testing Library)
```bash
cd ..
npm install --save-dev vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

---

## 🧪 3. Running Backend Tests {#backend-tests}

### Backend Test File
Location: `server/tests/announcement.test.js`

### Running Tests

#### Run all backend tests:
```bash
cd server
npm test
```

#### Run with coverage:
```bash
npm test -- --coverage
```

#### Run announcement tests only:
```bash
npm run test:announcements
```

#### Watch mode (auto-rerun on changes):
```bash
npm run test:watch
```

### Backend Test Coverage

The announcement tests cover:
- ✅ **POST /api/announcements** - Create announcements
  - Valid data creation
  - Missing title validation
  - Missing content validation
  - Invalid role enum validation
  
- ✅ **GET /api/announcements** - Fetch announcements
  - Fetching all announcements
  - Sorting by date (newest first)
  - Populated postedBy field
  - Empty array for no announcements
  
- ✅ **DELETE /api/announcements/:id** - Delete announcements
  - Successful deletion
  - 404 for non-existent ID
  - 500 for invalid ID format
  
- ✅ **Integration Tests**
  - Full CRUD cycle
  - Multiple roles (faculty + coordinator)

### Expected Output
```
PASS  tests/announcement.test.js
  Announcement API Tests
    POST /api/announcements
      ✓ should create a new announcement with valid data (45ms)
      ✓ should return 400 if title is missing (12ms)
      ✓ should return 400 if content is missing (10ms)
      ✓ should validate role enum (8ms)
    GET /api/announcements
      ✓ should fetch all announcements (15ms)
      ✓ should return announcements sorted by createdAt (12ms)
      ✓ should populate createdBy field (14ms)
      ✓ should return empty array (8ms)
    DELETE /api/announcements/:id
      ✓ should delete an announcement by ID (18ms)
      ✓ should return 404 for non-existent (10ms)
      ✓ should return 500 for invalid ID (9ms)
    Integration Tests
      ✓ should complete full CRUD cycle (32ms)
      ✓ should handle multiple roles (28ms)

Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
Coverage:    85% statements, 80% branches
```

---

## ⚛️ 4. Running Frontend Tests {#frontend-tests}

### Frontend Test File
Location: `src/tests/Announcements.test.jsx`

### Running Tests

#### Run all frontend tests:
```bash
npm test
```

#### Run with UI:
```bash
npm run test:ui
```

#### Run with coverage:
```bash
npm run test:coverage
```

### Frontend Test Coverage

The component tests cover:

#### **ParticipantDashboard**
- ✅ Display announcements section
- ✅ Empty state when no announcements
- ✅ API error handling
- ✅ Correct ordering (newest first)
- ✅ Date formatting

#### **FacultyDashboard**
- ✅ Announcement creation form
- ✅ Creating new announcements
- ✅ Deleting announcements
- ✅ Validation for empty fields

#### **CoordinatorDashboard**
- ✅ Announcements tab availability
- ✅ Creating coordinator announcements
- ✅ Role-specific posts

### Expected Output
```
✓ src/tests/Announcements.test.jsx (22 tests)
  ✓ ParticipantDashboard - Announcements
    ✓ should display announcements section
    ✓ should show empty state when no announcements
    ✓ should handle API error gracefully
    ✓ should display announcements in correct order
  ✓ FacultyDashboard - Announcements
    ✓ should display announcement creation form
    ✓ should create a new announcement
    ✓ should delete an announcement
    ✓ should show validation error for empty title
  ✓ CoordinatorDashboard - Announcements
    ✓ should have announcements tab available
    ✓ should create coordinator announcement
  ✓ Announcement Display Tests
    ✓ should format dates correctly
    ✓ should handle missing dates gracefully

Test Files  1 passed (1)
     Tests  22 passed (22)
  Duration  2.34s
```

---

## 📊 5. Test Coverage {#test-coverage}

### Viewing Coverage Reports

#### Backend:
```bash
cd server
npm test -- --coverage
# Open: server/coverage/lcov-report/index.html
```

#### Frontend:
```bash
npm run test:coverage
# Open: coverage/index.html
```

### Coverage Goals
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

---

## 🚀 6. Continuous Integration {#ci}

### GitHub Actions Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Run Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install backend dependencies
        run: |
          cd server
          npm ci
          
      - name: Run backend tests
        run: |
          cd server
          npm test -- --coverage
          
  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install frontend dependencies
        run: npm ci
        
      - name: Run frontend tests
        run: npm run test:coverage
```

---

## 🐛 Troubleshooting

### Issue: Tests timeout
**Solution:** Increase timeout in test files:
```javascript
jest.setTimeout(10000); // Backend
// or
test('...', async () => {...}, 10000); // Frontend
```

### Issue: MongoDB connection error
**Solution:** Set test database URL:
```bash
export MONGODB_TEST_URI="mongodb://localhost:27017/test_db"
```

### Issue: Module not found
**Solution:** Clear cache and reinstall:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port already in use
**Solution:** Kill the process:
```bash
lsof -ti:3001 | xargs kill
```

---

## 📝 Adding More Tests

### Backend Test Example
```javascript
describe('New Feature Tests', () => {
  it('should do something', async () => {
    const response = await request(app)
      .get('/api/endpoint')
      .expect(200);
    
    expect(response.body).toBeDefined();
  });
});
```

### Frontend Test Example
```javascript
import { render, screen } from '@testing-library/react';

test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

---

## ✅ Quick Start Checklist

- [ ] Fix node_modules permissions
- [ ] Install backend test dependencies
- [ ] Install frontend test dependencies
- [ ] Run backend tests (`cd server && npm test`)
- [ ] Run frontend tests (`npm test`)
- [ ] Check coverage reports
- [ ] Set up CI/CD (optional)

---

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest GitHub](https://github.com/visionmedia/supertest)

---

**Happy Testing! 🎉**

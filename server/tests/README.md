# 🧪 Announcement System Tests

This directory contains comprehensive automated tests for the announcement system.

## 📁 Test Files

### `announcement.test.js` - Backend API Tests
- **Lines**: 313
- **Test Cases**: 13
- **Coverage**: POST, GET, DELETE endpoints
- **Framework**: Jest + Supertest

### Test Breakdown:
```
✓ POST /api/announcements (4 tests)
  - Create with valid data
  - Validate required fields
  - Validate role enum
  
✓ GET /api/announcements (4 tests)
  - Fetch all announcements
  - Sort by date
  - Populate user data
  - Empty array handling
  
✓ DELETE /api/announcements/:id (3 tests)
  - Delete by ID
  - 404 for non-existent
  - 500 for invalid ID
  
✓ Integration Tests (2 tests)
  - Full CRUD cycle
  - Multi-role scenarios
```

## 🚀 Running Tests

### All Tests
```bash
npm test
```

### Specific Test File
```bash
npm run test:announcements
```

### With Coverage
```bash
npm test -- --coverage
```

### Watch Mode
```bash
npm run test:watch
```

## 📊 Expected Output

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
      ✓ should return empty array when no announcements (8ms)
    DELETE /api/announcements/:id
      ✓ should delete an announcement by ID (18ms)
      ✓ should return 404 for non-existent announcement (10ms)
      ✓ should return 500 for invalid ID format (9ms)
    Integration Tests
      ✓ should complete full CRUD cycle (32ms)
      ✓ should handle multiple roles (28ms)

Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        2.156 s
```

## 🧬 Test Structure

Each test follows this pattern:
```javascript
describe('Feature Area', () => {
  beforeEach(async () => {
    // Setup test data
  });

  it('should do something specific', async () => {
    // Arrange: Set up test data
    // Act: Perform action
    // Assert: Verify results
  });
});
```

## 🔍 What's Tested

### Data Validation
- ✅ Required fields enforced
- ✅ Data types validated
- ✅ Enum values checked
- ✅ ObjectId format validated

### Business Logic
- ✅ Announcements created with correct role
- ✅ Sorting by creation date works
- ✅ User population happens correctly
- ✅ Multi-role scenarios work

### Error Handling
- ✅ 400 for validation errors
- ✅ 404 for not found
- ✅ 500 for server errors
- ✅ Proper error messages returned

### Database Operations
- ✅ CREATE operations work
- ✅ READ operations work
- ✅ DELETE operations work
- ✅ Data persists correctly

## 📝 Adding New Tests

### Example Test
```javascript
describe('New Feature', () => {
  it('should handle new scenario', async () => {
    const response = await request(app)
      .post('/api/announcements')
      .send({
        title: 'Test',
        content: 'Content',
        date: new Date().toISOString(),
        role: 'faculty',
        postedBy: testUserId
      })
      .expect(201);

    expect(response.body).toHaveProperty('_id');
  });
});
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Set test database URL
export MONGODB_TEST_URI="mongodb://localhost:27017/test_db"
```

### Tests Timeout
```javascript
// Increase timeout
jest.setTimeout(10000);
```

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill
```

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest GitHub](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://testingjavascript.com/)

---

**Happy Testing! 🎉**

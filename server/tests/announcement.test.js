/**
 * Announcement API Tests
 * Tests for POST, GET, DELETE endpoints
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Export app from index.js
const Announcement = require('../models/Announcement');
const User = require('../models/User');

// Test database connection
beforeAll(async () => {
    const testDbUrl = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/semicon_summit_test';
    await mongoose.connect(testDbUrl);
});

afterAll(async () => {
    await mongoose.connection.close();
});

// Clean up after each test
afterEach(async () => {
    await Announcement.deleteMany({});
    await User.deleteMany({ email: /test@/ });
});

describe('Announcement API Tests', () => {
    let testUser;
    let testUserId;

    beforeEach(async () => {
        // Create a test user (Faculty)
        testUser = new User({
            name: 'Test Faculty',
            email: 'test@faculty.com',
            password: 'test123',
            role: 'faculty'
        });
        await testUser.save();
        testUserId = testUser._id;
    });

    /**
     * POST /api/announcements
     */
    describe('POST /api/announcements', () => {
        it('should create a new announcement with valid data', async () => {
            const announcementData = {
                title: 'Test Announcement',
                content: 'This is a test announcement content',
                date: new Date().toISOString(),
                role: 'faculty',
                postedBy: testUserId
            };

            const response = await request(app)
                .post('/api/announcements')
                .send(announcementData)
                .expect(201);

            expect(response.body).toHaveProperty('_id');
            expect(response.body.title).toBe('Test Announcement');
            expect(response.body.content).toBe('This is a test announcement content');
            expect(response.body.role).toBe('faculty');
        });

        it('should return 400 if title is missing', async () => {
            const invalidData = {
                content: 'Content without title',
                date: new Date().toISOString(),
                role: 'faculty',
                postedBy: testUserId
            };

            const response = await request(app)
                .post('/api/announcements')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('required');
        });

        it('should return 400 if content is missing', async () => {
            const invalidData = {
                title: 'Title without content',
                date: new Date().toISOString(),
                role: 'faculty',
                postedBy: testUserId
            };

            const response = await request(app)
                .post('/api/announcements')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('should validate role enum (faculty or coordinator)', async () => {
            const invalidRoleData = {
                title: 'Test',
                content: 'Content',
                date: new Date().toISOString(),
                role: 'invalid_role',
                postedBy: testUserId
            };

            const response = await request(app)
                .post('/api/announcements')
                .send(invalidRoleData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });
    });

    /**
     * GET /api/announcements
     */
    describe('GET /api/announcements', () => {
        beforeEach(async () => {
            // Create multiple test announcements
            const announcements = [
                {
                    title: 'Announcement 1',
                    content: 'First announcement',
                    date: new Date('2026-02-10').toISOString(),
                    role: 'faculty',
                    postedBy: testUserId
                },
                {
                    title: 'Announcement 2',
                    content: 'Second announcement',
                    date: new Date('2026-02-11').toISOString(),
                    role: 'coordinator',
                    postedBy: testUserId
                },
                {
                    title: 'Announcement 3',
                    content: 'Third announcement',
                    date: new Date('2026-02-12').toISOString(),
                    role: 'faculty',
                    postedBy: testUserId
                }
            ];

            await Announcement.insertMany(announcements);
        });

        it('should fetch all announcements', async () => {
            const response = await request(app)
                .get('/api/announcements')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(3);
        });

        it('should return announcements sorted by createdAt (newest first)', async () => {
            const response = await request(app)
                .get('/api/announcements')
                .expect(200);

            const dates = response.body.map(a => new Date(a.createdAt));
            for (let i = 0; i < dates.length - 1; i++) {
                expect(dates[i].getTime()).toBeGreaterThanOrEqual(dates[i + 1].getTime());
            }
        });

        it('should populate createdBy field with user name', async () => {
            const response = await request(app)
                .get('/api/announcements')
                .expect(200);

            expect(response.body[0]).toHaveProperty('postedBy');
            if (response.body[0].postedBy) {
                expect(response.body[0].postedBy).toHaveProperty('name');
            }
        });

        it('should return empty array when no announcements exist', async () => {
            await Announcement.deleteMany({});

            const response = await request(app)
                .get('/api/announcements')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    /**
     * DELETE /api/announcements/:id
     */
    describe('DELETE /api/announcements/:id', () => {
        let announcementId;

        beforeEach(async () => {
            const announcement = new Announcement({
                title: 'To Be Deleted',
                content: 'This will be deleted',
                date: new Date().toISOString(),
                role: 'faculty',
                postedBy: testUserId
            });
            await announcement.save();
            announcementId = announcement._id;
        });

        it('should delete an announcement by ID', async () => {
            const response = await request(app)
                .delete(`/api/announcements/${announcementId}`)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);

            // Verify it's actually deleted
            const deleted = await Announcement.findById(announcementId);
            expect(deleted).toBeNull();
        });

        it('should return 404 for non-existent announcement', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .delete(`/api/announcements/${fakeId}`)
                .expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('not found');
        });

        it('should return 500 for invalid ID format', async () => {
            const response = await request(app)
                .delete('/api/announcements/invalid_id')
                .expect(500);

            expect(response.body).toHaveProperty('error');
        });
    });

    /**
     * Integration Tests
     */
    describe('Announcement Integration Flow', () => {
        it('should complete full CRUD cycle', async () => {
            // 1. Create
            const createResponse = await request(app)
                .post('/api/announcements')
                .send({
                    title: 'Integration Test',
                    content: 'Full cycle test',
                    date: new Date().toISOString(),
                    role: 'faculty',
                    postedBy: testUserId
                })
                .expect(201);

            const announcementId = createResponse.body._id;

            // 2. Read (verify it exists)
            const getResponse = await request(app)
                .get('/api/announcements')
                .expect(200);

            expect(getResponse.body.length).toBe(1);
            expect(getResponse.body[0]._id).toBe(announcementId);

            // 3. Delete
            await request(app)
                .delete(`/api/announcements/${announcementId}`)
                .expect(200);

            // 4. Verify deletion
            const finalGetResponse = await request(app)
                .get('/api/announcements')
                .expect(200);

            expect(finalGetResponse.body.length).toBe(0);
        });

        it('should handle multiple announcements from different roles', async () => {
            // Create coordinator user
            const coordinator = new User({
                name: 'Test Coordinator',
                email: 'test@coordinator.com',
                password: 'test123',
                role: 'coordinator'
            });
            await coordinator.save();

            // Create announcements from both roles
            await request(app)
                .post('/api/announcements')
                .send({
                    title: 'Faculty Announcement',
                    content: 'From faculty',
                    date: new Date().toISOString(),
                    role: 'faculty',
                    postedBy: testUserId
                })
                .expect(201);

            await request(app)
                .post('/api/announcements')
                .send({
                    title: 'Coordinator Announcement',
                    content: 'From coordinator',
                    date: new Date().toISOString(),
                    role: 'coordinator',
                    postedBy: coordinator._id
                })
                .expect(201);

            // Get all
            const response = await request(app)
                .get('/api/announcements')
                .expect(200);

            expect(response.body.length).toBe(2);
            const roles = response.body.map(a => a.role);
            expect(roles).toContain('faculty');
            expect(roles).toContain('coordinator');
        });
    });
});

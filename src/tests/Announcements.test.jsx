/**
 * Frontend Component Tests for Announcements
 * Using React Testing Library + Jest
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ParticipantDashboard from '../pages/ParticipantDashboard';
import FacultyDashboard from '../pages/FacultyDashboard';
import CoordinatorDashboard from '../pages/CoordinatorDashboard';
import { AuthProvider } from '../context/AuthContext';
import api from '../services/api';

// Mock the API
jest.mock('../services/api');

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    User: () => <div>User Icon</div>,
    Calendar: () => <div>Calendar Icon</div>,
    Bell: () => <div>Bell Icon</div>,
    Image: () => <div>Image Icon</div>,
    LogOut: () => <div>LogOut Icon</div>,
    ChevronRight: () => <div>ChevronRight Icon</div>,
    ExternalLink: () => <div>ExternalLink Icon</div>,
    Search: () => <div>Search Icon</div>,
    Filter: () => <div>Filter Icon</div>,
    Download: () => <div>Download Icon</div>,
    Trash2: () => <div>Trash Icon</div>,
    Upload: () => <div>Upload Icon</div>,
    FileText: () => <div>FileText Icon</div>,
}));

// Helper function to wrap components with providers
const renderWithProviders = (component, user = null) => {
    return render(
        <BrowserRouter>
            <AuthProvider initialUser={user}>
                {component}
            </AuthProvider>
        </BrowserRouter>
    );
};

describe('ParticipantDashboard - Announcements', () => {
    const mockUser = {
        _id: '123',
        name: 'Test Participant',
        email: 'participant@test.com',
        role: 'participant',
        college: 'Test University',
        phone: '1234567890'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should display announcements section', async () => {
        const mockAnnouncements = [
            {
                _id: '1',
                title: 'Welcome to Summit',
                content: 'Looking forward to seeing you all',
                date: '2026-02-11T00:00:00.000Z',
                role: 'faculty'
            },
            {
                _id: '2',
                title: 'Schedule Update',
                content: 'Event schedule has been updated',
                date: '2026-02-10T00:00:00.000Z',
                role: 'coordinator'
            }
        ];

        api.get.mockResolvedValueOnce({ data: mockAnnouncements }); // announcements
        api.get.mockResolvedValueOnce({ data: [] }); // gallery

        renderWithProviders(<ParticipantDashboard />, mockUser);

        // Wait for announcements to load
        await waitFor(() => {
            expect(screen.getByText('Welcome to Summit')).toBeInTheDocument();
        });

        expect(screen.getByText('Looking forward to seeing you all')).toBeInTheDocument();
        expect(screen.getByText('Schedule Update')).toBeInTheDocument();
    });

    it('should show empty state when no announcements', async () => {
        api.get.mockResolvedValueOnce({ data: [] }); // announcements
        api.get.mockResolvedValueOnce({ data: [] }); // gallery

        renderWithProviders(<ParticipantDashboard />, mockUser);

        await waitFor(() => {
            expect(screen.getByText('No announcements yet')).toBeInTheDocument();
        });
    });

    it('should handle API error gracefully', async () => {
        api.get.mockRejectedValueOnce(new Error('Network error'));
        api.get.mockResolvedValueOnce({ data: [] }); // gallery

        renderWithProviders(<ParticipantDashboard />, mockUser);

        // Should not crash and show empty state
        await waitFor(() => {
            expect(screen.getByText('No announcements yet')).toBeInTheDocument();
        });
    });

    it('should display announcements in correct order (newest first)', async () => {
        const mockAnnouncements = [
            {
                _id: '1',
                title: 'Newest',
                content: 'Latest announcement',
                date: '2026-02-12T00:00:00.000Z',
                role: 'faculty',
                createdAt: '2026-02-12T10:00:00.000Z'
            },
            {
                _id: '2',
                title: 'Older',
                content: 'Older announcement',
                date: '2026-02-11T00:00:00.000Z',
                role: 'coordinator',
                createdAt: '2026-02-11T10:00:00.000Z'
            }
        ];

        api.get.mockResolvedValueOnce({ data: mockAnnouncements });
        api.get.mockResolvedValueOnce({ data: [] });

        renderWithProviders(<ParticipantDashboard />, mockUser);

        await waitFor(() => {
            const titles = screen.getAllByRole('heading', { level: 4 });
            const announcementTitles = titles.filter(h =>
                h.textContent === 'Newest' || h.textContent === 'Older'
            );
            expect(announcementTitles[0].textContent).toBe('Newest');
        });
    });
});

describe('FacultyDashboard - Announcements', () => {
    const mockFaculty = {
        _id: '456',
        name: 'Dr. Faculty',
        email: 'faculty@test.com',
        role: 'faculty'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should display announcement creation form', async () => {
        api.get.mockResolvedValue({ data: [] }); // participants
        api.get.mockResolvedValue({ data: [] }); // announcements

        renderWithProviders(<FacultyDashboard />, mockFaculty);

        await waitFor(() => {
            expect(screen.getByPlaceholderText(/announcement title/i)).toBeInTheDocument();
        });

        expect(screen.getByPlaceholderText(/announcement content/i)).toBeInTheDocument();
    });

    it('should create a new announcement', async () => {
        const mockAnnouncements = [];
        api.get.mockResolvedValue({ data: [] }); // initial announcements
        api.post.mockResolvedValueOnce({
            data: {
                _id: '789',
                title: 'New Announcement',
                content: 'Test content',
                date: '2026-02-11',
                role: 'faculty'
            }
        });
        api.get.mockResolvedValueOnce({
            data: [
                {
                    _id: '789',
                    title: 'New Announcement',
                    content: 'Test content',
                    date: '2026-02-11',
                    role: 'faculty'
                }
            ]
        }); // refresh announcements

        renderWithProviders(<FacultyDashboard />, mockFaculty);

        // Switch to announcements tab
        await waitFor(() => {
            const announcementsTab = screen.getByText(/announcements/i, { selector: 'button' });
            fireEvent.click(announcementsTab);
        });

        // Fill the form
        const titleInput = screen.getByPlaceholderText(/announcement title/i);
        const contentInput = screen.getByPlaceholderText(/announcement content/i);
        const dateInput = screen.getByLabelText(/date/i);

        fireEvent.change(titleInput, { target: { value: 'New Announcement' } });
        fireEvent.change(contentInput, { target: { value: 'Test content' } });
        fireEvent.change(dateInput, { target: { value: '2026-02-11' } });

        // Submit
        const submitButton = screen.getByText(/create announcement/i, { selector: 'button' });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/announcements', expect.objectContaining({
                title: 'New Announcement',
                content: 'Test content',
                date: '2026-02-11',
                role: 'faculty'
            }));
        });
    });

    it('should delete an announcement', async () => {
        const mockAnnouncements = [
            {
                _id: 'delete-me',
                title: 'To Be Deleted',
                content: 'This will be deleted',
                date: '2026-02-11',
                role: 'faculty'
            }
        ];

        api.get.mockResolvedValueOnce({ data: mockAnnouncements });
        api.delete.mockResolvedValueOnce({ data: { success: true } });
        api.get.mockResolvedValueOnce({ data: [] }); // refresh after delete

        renderWithProviders(<FacultyDashboard />, mockFaculty);

        await waitFor(() => {
            expect(screen.getByText('To Be Deleted')).toBeInTheDocument();
        });

        // Click delete button
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/announcements/delete-me');
        });
    });

    it('should show validation error for empty title', async () => {
        api.get.mockResolvedValue({ data: [] });

        renderWithProviders(<FacultyDashboard />, mockFaculty);

        await waitFor(() => {
            const announcementsTab = screen.getByText(/announcements/i, { selector: 'button' });
            fireEvent.click(announcementsTab);
        });

        // Try to submit without title
        const submitButton = screen.getByText(/create announcement/i, { selector: 'button' });
        fireEvent.click(submitButton);

        // Should not call API
        expect(api.post).not.toHaveBeenCalled();
    });
});

describe('CoordinatorDashboard - Announcements', () => {
    const mockCoordinator = {
        _id: '789',
        name: 'Test Coordinator',
        email: 'coordinator@test.com',
        role: 'coordinator'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should have announcements tab available', async () => {
        api.get.mockResolvedValue({ data: [] });

        renderWithProviders(<CoordinatorDashboard />, mockCoordinator);

        await waitFor(() => {
            expect(screen.getByText(/announcements/i, { selector: 'button' })).toBeInTheDocument();
        });
    });

    it('should create coordinator announcement', async () => {
        api.get.mockResolvedValue({ data: [] });
        api.post.mockResolvedValueOnce({
            data: {
                _id: 'coord-1',
                title: 'Coordinator Update',
                content: 'Important update',
                date: '2026-02-11',
                role: 'coordinator'
            }
        });
        api.get.mockResolvedValueOnce({
            data: [{
                _id: 'coord-1',
                title: 'Coordinator Update',
                content: 'Important update',
                date: '2026-02-11',
                role: 'coordinator'
            }]
        });

        renderWithProviders(<CoordinatorDashboard />, mockCoordinator);

        // Switch to announcements
        await waitFor(() => {
            const announcementsTab = screen.getByText(/announcements/i, { selector: 'button' });
            fireEvent.click(announcementsTab);
        });

        // Fill form
        const titleInput = screen.getByPlaceholderText(/announcement title/i);
        const contentInput = screen.getByPlaceholderText(/announcement content/i);

        fireEvent.change(titleInput, { target: { value: 'Coordinator Update' } });
        fireEvent.change(contentInput, { target: { value: 'Important update' } });

        // Submit
        const submitButton = screen.getByText(/post announcement/i, { selector: 'button' });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/announcements', expect.objectContaining({
                role: 'coordinator'
            }));
        });
    });
});

describe('Announcement Display Tests', () => {
    it('should format dates correctly', async () => {
        const mockAnnouncements = [
            {
                _id: '1',
                title: 'Test',
                content: 'Content',
                date: '2026-02-11T00:00:00.000Z',
                role: 'faculty'
            }
        ];

        api.get.mockResolvedValueOnce({ data: mockAnnouncements });
        api.get.mockResolvedValueOnce({ data: [] });

        renderWithProviders(<ParticipantDashboard />, {
            name: 'Test User',
            email: 'test@test.com',
            role: 'participant'
        });

        await waitFor(() => {
            // Date should be formatted (exact format varies by locale)
            expect(screen.getByText(/2\/11\/2026|11\/02\/2026|2026/)).toBeInTheDocument();
        });
    });

    it('should handle missing dates gracefully', async () => {
        const mockAnnouncements = [
            {
                _id: '1',
                title: 'No Date',
                content: 'Content',
                role: 'faculty'
                // date is missing
            }
        ];

        api.get.mockResolvedValueOnce({ data: mockAnnouncements });
        api.get.mockResolvedValueOnce({ data: [] });

        renderWithProviders(<ParticipantDashboard />, {
            name: 'Test User',
            email: 'test@test.com',
            role: 'participant'
        });

        await waitFor(() => {
            expect(screen.getByText('N/A')).toBeInTheDocument();
        });
    });
});

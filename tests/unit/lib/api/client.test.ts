import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import { apiClient, ApiError } from '../../../../lib/api/client';
import { useAuthStore } from '../../../../lib/stores/useAuthStore';

// Mock the auth store
vi.mock('../../../../lib/stores/useAuthStore', () => ({
    useAuthStore: {
        getState: vi.fn(),
    },
}));

describe('apiClient', () => {
    const mockLogout = vi.fn();

    beforeEach(() => {
        // Reset mocks before each test
        vi.resetAllMocks();
        (useAuthStore.getState as Mock).mockReturnValue({ logout: mockLogout });
        global.fetch = vi.fn();
    });

    afterEach(() => {
        // Clean up spy
        vi.restoreAllMocks();
    });

    it('should call fetch with the correct URL and default options', async () => {
        (global.fetch as Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ data: 'success' }),
        });

        await apiClient('/api/v1/test');

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3001/api/v1/test',
            expect.objectContaining({
                credentials: 'include',
                headers: expect.any(Headers),
            })
        );
    });

    it('should automatically set Content-Type for POST requests', async () => {
        (global.fetch as Mock).mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });

        await apiClient('/api/v1/test', { method: 'POST', body: JSON.stringify({ name: 'test' }) });

        const fetchOptions = (global.fetch as Mock).mock.calls[0][1];
        expect(fetchOptions.headers.get('Content-Type')).toBe('application/json');
    });

    it('should throw an ApiError for non-ok responses', async () => {
        (global.fetch as Mock).mockResolvedValue({
            ok: false,
            status: 500,
            json: () => Promise.resolve({ message: 'Internal Server Error' }),
        });

        await expect(apiClient('/api/v1/error')).rejects.toThrow(ApiError);
        await expect(apiClient('/api/v1/error')).rejects.toThrow('Internal Server Error');
    });

    describe('401 Unauthorized Error Handling', () => {
        it('should throw an ApiError and call logout on 401 response', async () => {
            (global.fetch as Mock).mockResolvedValue({
                ok: false,
                status: 401,
                json: () => Promise.resolve({ message: 'Unauthorized' }),
            });

            // We expect a rejection, so we wrap it in a try/catch to verify both parts
            try {
                await apiClient('/api/v1/protected');
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(401);
                expect((error as ApiError).message).toBe('Unauthorized');
            }

            // Verify that logout was called
            expect(mockLogout).toHaveBeenCalledTimes(1);
        });

        it('should not call logout if the request was to the logout endpoint itself', async () => {
            (global.fetch as Mock).mockResolvedValue({
                ok: false,
                status: 401,
                json: () => Promise.resolve({ message: 'Already logged out' }),
            });

            try {
                await apiClient('/api/v1/auth/logout');
            } catch (error) {
                // We expect the error, but we want to ensure logout was NOT called
            }

            expect(mockLogout).not.toHaveBeenCalled();
        });
    });
});

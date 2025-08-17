import { create } from 'zustand';
import { z } from 'zod';

// Zod schema for user object
export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.string()
});

// TypeScript type derived from Zod schema
export type User = z.infer<typeof userSchema>;

// Types for the authentication state
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// Types for the authentication actions
interface AuthActions {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

// Create and export the authentication store
export const useAuthStore = create<AuthState & AuthActions>((set) => ({
    // Initial state
    user: null,
    isAuthenticated: false,
    isLoading: false,

    // Login action (placeholder implementation)
    login: async (email: string, password: string) => {
        set({ isLoading: true });

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulate successful login with fake user data
        const fakeUser: User = {
            id: '1',
            name: 'Usuario de Prueba',
            email,
            role: 'USER'
        };

        // Update state with user data and authentication status
        set({
            user: fakeUser,
            isAuthenticated: true,
            isLoading: false
        });
    },

    // Logout action
    logout: () => {
        // Update state to reflect logged out status
        set({
            user: null,
            isAuthenticated: false
        });
    }
}));

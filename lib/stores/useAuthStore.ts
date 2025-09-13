import { create } from 'zustand';
import type { User } from '@/types/inventory';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    sessionChecked: boolean;
    users: User[];
    error?: string | null;
}

interface AuthActions {
    login: (usernameOrEmail: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
    addUser: (user: Omit<User, 'id'> & Partial<Pick<User, 'id'>>) => void;
    updateCurrentUser: (updates: Partial<User>) => void;
}

// Mock users list (aligned with unified User contract from @/types/inventory)
const fakeUsers: (User & { password: string })[] = [
    {
        id: '1',
        name: 'Carlos Vera',
        email: 'carlos@example.com',
        password: 'password123',
        role: 'ADMINISTRADOR',
        isActive: true,
        lastLoginAt: new Date().toISOString(),
        trusted_ip: '192.168.1.100',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Ana López',
        email: 'ana@example.com',
        password: 'password123',
        role: 'EDITOR',
        isActive: true,
        lastLoginAt: new Date().toISOString(),
        trusted_ip: '192.168.1.101',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '3',
        name: 'Pedro García',
        email: 'pedro@example.com',
        password: 'password123',
        role: 'LECTOR',
        isActive: true,
        lastLoginAt: new Date().toISOString(),
        trusted_ip: '192.168.1.102',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
];

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    sessionChecked: false,
    users: fakeUsers.map(({ password: _p, ...u }) => u),
    error: null,

    login: async (usernameOrEmail: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const { loginUser } = await import('../api/auth');
            const loggedInUser = await loginUser(usernameOrEmail, password);
            set({ user: loggedInUser, isAuthenticated: true, error: null });
        } catch (err: any) {
            const message = err?.message || 'Login failed';
            set({ error: message });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        try {
            const { logoutUser } = await import('../api/auth');
            await logoutUser();
            set({ user: null, isAuthenticated: false, error: null });
        } catch (err) {
            // Ensure UI logs the user out regardless of API outcome
            set({ user: null, isAuthenticated: false, error: null });
        }
    },

    checkSession: async () => {
        set({ isLoading: true });
        try {
            const { getProfile } = await import('../api/auth');
            const profile = await getProfile();
            if (profile) {
                set({ user: profile, isAuthenticated: true });
            } else {
                set({ user: null, isAuthenticated: false });
            }
        } catch {
            set({ user: null, isAuthenticated: false });
        } finally {
            set({ isLoading: false, sessionChecked: true });
        }
    },

    addUser: (newUser) => {
        const nextId = Math.max(0, ...get().users.map(u => parseInt(u.id))) + 1;
        const userToAdd: User = {
            id: newUser.id ?? nextId.toString(),
            name: newUser.name || 'Nuevo Usuario',
            email: newUser.email || `${Date.now()}@example.com`,
            role: newUser.role || 'LECTOR',
            isActive: true,
            lastLoginAt: null,
            trusted_ip: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        set({ users: [...get().users, userToAdd] });
    },
    updateCurrentUser: (updates) => {
        const current = get().user;
        if (!current) return;
        const updated = { ...current, ...updates } as User;
        set({ user: updated, users: get().users.map(u => u.id === updated.id ? updated : u) });
    },
}));

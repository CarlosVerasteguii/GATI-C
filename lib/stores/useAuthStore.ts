import { create } from 'zustand';
import type { User } from '@/types/inventory';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    users: User[];
    error?: string | null;
}

interface AuthActions {
    login: (usernameOrEmail: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    addUser: (user: Omit<User, 'id'> & Partial<Pick<User, 'id'>>) => void;
    updateCurrentUser: (updates: Partial<User>) => void;
}

// Mock users list (migrated from legacy context)
const fakeUsers: User[] = [
    { id: 1, nombre: 'Carlos Vera', email: 'carlos@example.com', password: 'password123', rol: 'Administrador' },
    { id: 2, nombre: 'Ana López', email: 'ana@example.com', password: 'password123', rol: 'Editor' },
    { id: 3, nombre: 'Pedro García', email: 'pedro@example.com', password: 'password123', rol: 'Lector' },
];

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    users: fakeUsers.map(({ password: _p, ...u }) => u as User),
    error: null,

    login: async (usernameOrEmail: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const { loginUser } = await import('../api/auth');
            const loggedInUser = await loginUser(usernameOrEmail, password);
            set({ user: loggedInUser as User, isAuthenticated: true, isLoading: false, error: null });
        } catch (err: any) {
            const message = err?.message || 'Login failed';
            set({ isLoading: false, error: message });
            throw err;
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

    addUser: (newUser) => {
        const nextId = Math.max(0, ...get().users.map(u => u.id)) + 1;
        const userToAdd: User = {
            id: newUser.id ?? nextId,
            nombre: newUser.nombre || 'Nuevo Usuario',
            email: newUser.email || `${Date.now()}@example.com`,
            rol: newUser.rol || 'Lector',
            departamento: newUser.departamento,
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

import { create } from 'zustand';
import type { User } from '@/types/inventory';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    users: User[];
}

interface AuthActions {
    login: (usernameOrEmail: string, password: string) => Promise<void>;
    logout: () => void;
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

    login: async (usernameOrEmail: string, password: string) => {
        set({ isLoading: true });
        try {
            // Simulate latency
            await new Promise((resolve) => setTimeout(resolve, 300));

            const found = get().users.find((u) => (
                u.email.toLowerCase() === usernameOrEmail.toLowerCase() ||
                u.nombre.toLowerCase() === usernameOrEmail.toLowerCase()
            ) && (password === 'password123')); // Mock validation

            if (!found) {
                throw new Error('INVALID_CREDENTIALS');
            }

            // Avoid keeping password in memory
            const userWithoutPassword = found;
            set({
                user: userWithoutPassword as User,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (err) {
            set({ isLoading: false });
            throw err;
        }
    },

    logout: () => {
        set({ user: null, isAuthenticated: false });
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

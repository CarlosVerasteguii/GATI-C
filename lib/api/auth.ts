export interface LoginResponseUser {
    id: number;
    nombre: string;
    email: string;
    rol: "Administrador" | "Editor" | "Lector";
    departamento?: string;
}

import { apiClient, ApiError } from "@/lib/api/client";

export async function loginUser(email: string, password: string): Promise<LoginResponseUser> {
    const response = await apiClient("http://localhost:3001/api/v1/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    let payload: any = null;
    try {
        payload = await response.json();
    } catch (e) {
        // Ignore JSON parse errors; we'll construct a fallback message
    }

    // apiClient already throws on non-ok

    // Basic shape validation
    if (!payload || typeof payload !== "object" || !payload.user) {
        throw new Error("Invalid login response from server");
    }

    return payload.user as LoginResponseUser;
}

export async function logoutUser(): Promise<void> {
    await apiClient("http://localhost:3001/api/v1/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function getProfile(): Promise<LoginResponseUser | null> {
    try {
        const response = await apiClient("http://localhost:3001/api/v1/auth/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        try {
            const payload = await response.json();
            if (!payload || typeof payload !== "object" || !payload.user) {
                return null;
            }
            return payload.user as LoginResponseUser;
        } catch {
            return null;
        }
    } catch (err: any) {
        if (err && err.name === "ApiError" && typeof err.status === "number") {
            if (err.status === 401) {
                // Not authenticated -> treat as no session
                return null;
            }
        }
        // Re-throw other errors for observability
        throw err;
    }
}

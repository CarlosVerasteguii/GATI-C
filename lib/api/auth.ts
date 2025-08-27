import type { User } from "@/types/inventory";

import { apiClient, ApiError } from "./client";

export async function loginUser(email: string, password: string): Promise<User> {
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

    // Backend responds with { success: true, data: { ...User } }
    if (!payload || typeof payload !== "object" || !payload.data) {
        throw new Error("Invalid response structure from login API");
    }

    return payload.data as User;
}

export async function logoutUser(): Promise<void> {
    await apiClient("http://localhost:3001/api/v1/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function getProfile(): Promise<User> {
    try {
        const response = await apiClient("http://localhost:3001/api/v1/auth/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const payload = await response.json();
        if (!payload || typeof payload !== "object" || !payload.data) {
            throw new Error("Invalid response structure from profile API");
        }
        return payload.data as User;
    } catch (err: any) {
        if (err && err.name === "ApiError" && typeof err.status === "number") {
            if (err.status === 401) {
                // Not authenticated -> propagate to caller per contract (Promise<User> or throw)
                throw err;
            }
        }
        throw err;
    }
}

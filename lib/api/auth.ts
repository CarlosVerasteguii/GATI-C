import type { User } from "@/types/inventory";

import { apiClient, ApiError } from "./client";

// Resiliencia pragmática en el punto de consumo:
// Sanea el payload del backend al tipo legado `User` esperado por la UI.
export function sanitizeUserFromApi(payload: any): User {
    // Mapear roles a los valores esperados por la UI (ES):
    // - Acepta roles en español directamente
    // - Normaliza roles en inglés a español
    // - Cualquier otro valor -> 'LECTOR' y advertencia
    const roleRaw = payload?.role;
    let role: User["role"];
    if (roleRaw === "ADMINISTRADOR" || roleRaw === "EDITOR" || roleRaw === "LECTOR") {
        role = roleRaw;
    } else if (roleRaw === "ADMINISTRATOR") {
        role = "ADMINISTRADOR";
    } else if (roleRaw === "EDITOR") {
        role = "EDITOR";
    } else if (roleRaw === "READER") {
        role = "LECTOR";
    } else {
        console.warn("Rol de usuario inesperado recibido:", roleRaw);
        role = "LECTOR";
    }

    const id = typeof payload?.id === "string" ? payload.id : "";
    const name = typeof payload?.name === "string" && payload.name.trim() ? payload.name : "Usuario";
    const email = typeof payload?.email === "string" && payload.email.trim() ? payload.email : "unknown@example.com";
    const isActive = typeof payload?.isActive === "boolean" ? payload.isActive : false;

    // Normalizar fechas a strings ISO, usar ahora() si faltan
    const toIso = (v: any, fallbackNow = false): string => {
        if (typeof v === "string" && v) return v;
        if (v instanceof Date) return v.toISOString();
        return fallbackNow ? new Date().toISOString() : new Date().toISOString();
    };

    const createdAt = toIso(payload?.createdAt, true);
    const updatedAt = toIso(payload?.updatedAt, true);
    const lastLoginAt = typeof payload?.lastLoginAt === "string" ? payload.lastLoginAt : null;

    // Casing: trusted_ip desde trustedIp
    const trusted_ip = typeof payload?.trustedIp === "string" ? payload.trustedIp : (payload?.trustedIp === null ? null : undefined);

    const user: User = {
        id,
        name,
        email,
        role,
        isActive,
        lastLoginAt,
        createdAt,
        updatedAt,
        ...(typeof trusted_ip !== "undefined" ? { trusted_ip } : {}),
    };

    return user;
}

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

    return sanitizeUserFromApi(payload.data);
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
        return sanitizeUserFromApi(payload.data);
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

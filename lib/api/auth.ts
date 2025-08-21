export interface LoginResponseUser {
    id: number;
    nombre: string;
    email: string;
    rol: "Administrador" | "Editor" | "Lector";
    departamento?: string;
}

export async function loginUser(email: string, password: string): Promise<LoginResponseUser> {
    const response = await fetch("http://localhost:3001/api/v1/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });

    let payload: any = null;
    try {
        payload = await response.json();
    } catch (e) {
        // Ignore JSON parse errors; we'll construct a fallback message
    }

    if (!response.ok) {
        const message = (payload && (payload.message || payload.error)) || `Login failed with status ${response.status}`;
        throw new Error(message);
    }

    // Basic shape validation
    if (!payload || typeof payload !== "object" || !payload.user) {
        throw new Error("Invalid login response from server");
    }

    return payload.user as LoginResponseUser;
}

export async function logoutUser(): Promise<void> {
    const response = await fetch("http://localhost:3001/api/v1/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        let payload: any = null;
        try { payload = await response.json(); } catch { }
        const message = (payload && (payload.message || payload.error)) || `Logout failed with status ${response.status}`;
        throw new Error(message);
    }
}

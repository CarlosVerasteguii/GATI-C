
export class ApiError extends Error {
    status: number;
    body?: any;

    constructor(status: number, message: string, body?: any) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.body = body;
    }
}

let isHandling401 = false;

function resolveUrl(input: RequestInfo | URL): string {
    if (typeof input === "string") return input;
    if (input instanceof URL) return input.href;
    // For Request objects
    try {
        // Request has url at runtime
        return (input as any).url as string;
    } catch {
        return String(input);
    }
}

function isLogoutRequest(input: RequestInfo | URL): boolean {
    const url = resolveUrl(input);
    return url.includes("/api/v1/auth/logout");
}

export async function apiClient(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
    const mergedInit: RequestInit = {
        credentials: "include",
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init.headers || {}),
        },
    };

    const response = await fetch(input as any, mergedInit);

    if (response.status === 401) {
        // Extract any possible error payload for better messages
        let payload: any = null;
        try { payload = await response.json(); } catch { /* ignore */ }

        // Prevent re-entrant infinite loops when logout triggers another 401
        if (!isHandling401 && !isLogoutRequest(input)) {
            isHandling401 = true;
            try {
                // Fire-and-forget logout to clear client state
                const { useAuthStore } = await import("../stores/useAuthStore");
                Promise.resolve(useAuthStore.getState().logout()).catch(() => { /* ignore */ });
            } finally {
                isHandling401 = false;
            }
        }

        const message = (payload && (payload.message || payload.error)) || "Unauthorized";
        throw new ApiError(401, message, payload);
    }

    if (!response.ok) {
        let payload: any = null;
        try { payload = await response.json(); } catch { /* ignore */ }
        const message = (payload && (payload.message || payload.error)) || `Request failed with status ${response.status}`;
        throw new ApiError(response.status, message, payload);
    }

    return response;
}


// SWR fetcher compatible with our apiClient
export const fetcher = async (url: string) => {
    const response = await apiClient(url);
    return response.json();
};

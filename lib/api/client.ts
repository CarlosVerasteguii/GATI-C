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

// Resolve API base URL from env with a safe default
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001').replace(/\/+$/, '');

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

function isAbsoluteUrl(url: string): boolean {
    return /^https?:\/\//i.test(url);
}

function joinUrl(base: string, path: string): string {
    if (!path) return base;
    if (isAbsoluteUrl(path)) return path;
    const normalizedBase = base.replace(/\/+$/, '');
    const normalizedPath = path.replace(/^\/+/, '');
    return `${normalizedBase}/${normalizedPath}`;
}

export async function apiClient(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
    const method = (init.method ?? 'GET').toString().toUpperCase();

    // Start with provided headers and enforce Accept. Conditionally set Content-Type for JSON methods.
    const headers = new Headers(init.headers as HeadersInit | undefined);
    if (!headers.has('Accept')) headers.set('Accept', 'application/json');
    if ((method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        const isFormDataBody = typeof FormData !== 'undefined' && (init.body instanceof FormData);
        if (!isFormDataBody && !headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }
    }

    const mergedInit: RequestInit = {
        credentials: "include",
        ...init,
        headers,
    };

    const inputUrl = resolveUrl(input);
    const finalUrl = isAbsoluteUrl(inputUrl) ? inputUrl : joinUrl(API_BASE_URL, inputUrl);

    const response = await fetch(finalUrl as any, mergedInit);

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

export default apiClient;

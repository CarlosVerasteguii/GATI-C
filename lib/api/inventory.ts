import { apiClient } from './client';

// Unified frontend contract (camelCase) matching domain language
export interface CreateProductData {
    name: string;
    serialNumber?: string | null;
    description?: string | null;
    cost?: number | null;
    purchaseDate?: string | null;
    condition?: string | null;
    brandId?: string | null;
    categoryId?: string | null;
    locationId?: string | null;
}

// All fields optional for update
export interface UpdateProductData {
    name?: string;
    serialNumber?: string | null;
    description?: string | null;
    cost?: number | null;
    purchaseDate?: string | null;
    condition?: string | null;
    brandId?: string | null;
    categoryId?: string | null;
    locationId?: string | null;
}

// Internal helper to adapt camelCase to backend schema
function adaptToBackend(payload: CreateProductData | UpdateProductData) {
    const { purchaseDate, serialNumber, ...rest } = payload as any;
    return {
        ...rest,
        ...(serialNumber !== undefined ? { serial_number: serialNumber } : {}),
        ...(purchaseDate !== undefined ? { purchase_date: purchaseDate } : {}),
    };
}

// Create
export async function createProductAPI(payload: CreateProductData) {
    const response = await apiClient('/api/v1/inventory', {
        method: 'POST',
        body: JSON.stringify(adaptToBackend(payload)),
    });
    return response.json();
}

// Update
export async function updateProductAPI(productId: string, payload: UpdateProductData) {
    const response = await apiClient(`/api/v1/inventory/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(adaptToBackend(payload)),
    });
    return response.json();
}

// Delete
export async function deleteProductAPI(productId: string) {
    const response = await apiClient(`/api/v1/inventory/${productId}`, {
        method: 'DELETE',
    });
    return response.ok;
}

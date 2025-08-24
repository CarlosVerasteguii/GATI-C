import { apiClient } from './client';

// Frontend contract (camelCase) aligned with backend createProductSchema
export interface CreateProductData {
    name: string;
    serialNumber?: string | null;
    description?: string | null;
    cost?: number | null;
    purchaseDate?: string | null;
    brandId?: string | null;
    categoryId?: string | null;
    locationId?: string | null;
    contractId?: string | null;
}

// All fields optional for update
export interface UpdateProductData {
    name?: string;
    serialNumber?: string | null;
    description?: string | null;
    cost?: number | null;
    purchaseDate?: string | null;
    brandId?: string | null;
    categoryId?: string | null;
    locationId?: string | null;
    contractId?: string | null;
}

// Create
export async function createProductAPI(payload: CreateProductData) {
    const response = await apiClient('/api/v1/inventory', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    return response.json();
}

// Update
export async function updateProductAPI(productId: string, payload: UpdateProductData) {
    const response = await apiClient(`/api/v1/inventory/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
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

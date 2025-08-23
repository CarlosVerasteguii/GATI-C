import { apiClient } from './client';

// Contract aligned to backend createProductSchema
// backend/src/modules/inventory/inventory.types.ts
// Fields: name, serial_number, description, cost, purchase_date, condition, brandId, categoryId, locationId
export interface CreateProductData {
    name: string;
    serial_number?: string | null;
    description?: string | null;
    cost?: number | null;
    purchase_date?: string | null;
    condition?: string | null;
    brandId?: string | null;
    categoryId?: string | null;
    locationId?: string | null;
}

// Contract aligned to backend updateProductSchema (all fields optional)
export interface UpdateProductData {
    name?: string;
    serial_number?: string | null;
    description?: string | null;
    cost?: number | null;
    purchase_date?: string | null;
    condition?: string | null;
    brandId?: string | null;
    categoryId?: string | null;
    locationId?: string | null;
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
    // DELETE returns 204 No Content in backend; no JSON body expected
    return response.ok;
}

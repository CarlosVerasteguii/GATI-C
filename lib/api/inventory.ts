import { apiClient } from './client';

// Tipo para crear un nuevo producto (sin campos generados por el servidor)
export interface CreateProductData {
    nombre: string;
    marca: string;
    modelo: string;
    numeroSerie?: string | null;
    categoria: string;
    descripcion?: string;
    estado: string;
    cantidad: number;
    fechaIngreso: string;
    ubicacion?: string;
    proveedor?: string;
    costo?: number;
    fechaAdquisicion?: string;
    fechaVencimientoGarantia?: string | null;
    vidaUtil?: string;
    isSerialized?: boolean;
    contratoId?: string | null;
}

// Tipo que el backend espera (basado en createProductSchema)
// backend/src/modules/inventory/inventory.types.ts
// Fields: name, serial_number, description, cost, purchase_date, condition, brandId, categoryId, locationId
export type BackendCreateProductPayload = {
    name: string;
    serial_number?: string | null;
    description?: string | null;
    cost?: number | null;
    purchase_date?: string | null;
    condition?: string | null;
    brandId?: string | null;
    categoryId?: string | null;
    locationId?: string | null;
};

// Traducción de los datos del frontend (es-ES) al payload esperado por el backend (en/snake_case)
function mapFrontendToBackend(frontendData: CreateProductData): BackendCreateProductPayload {
    return {
        name: frontendData.nombre,
        serial_number: frontendData.numeroSerie ?? null,
        description: frontendData.descripcion ?? null,
        cost: frontendData.costo ?? null,
        purchase_date: frontendData.fechaAdquisicion ?? null,
        condition: frontendData.estado ?? null,
        // Relacionales: hasta tener IDs reales, enviar null
        brandId: null,
        categoryId: null,
        locationId: null,
    };
}

// Función para crear un nuevo producto
export async function createProductAPI(newProductData: CreateProductData) {
    const backendPayload = mapFrontendToBackend(newProductData);
    const response = await apiClient('/api/v1/inventory', {
        method: 'POST',
        body: JSON.stringify(backendPayload),
    });

    return response.json();
}

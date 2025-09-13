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

// Función para crear un nuevo producto
export async function createProductAPI(productData: CreateProductData) {
    const response = await apiClient('/api/v1/inventory', {
        method: 'POST',
        body: JSON.stringify(productData),
    });

    return response.json();
}

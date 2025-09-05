import useSWR from 'swr';
import { fetcher } from '@/lib/api/client';

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

// TODO: Eliminar este mapeo cuando el frontend se sincronice a inglés.
function mapBackendToFrontend(backendProduct: any) {
    return {
        id: backendProduct.id,
        nombre: backendProduct.name,
        numeroSerie: backendProduct.serial_number ?? null,
        marca: backendProduct.brand?.name ?? '',
        modelo: '',
        categoria: backendProduct.category?.name ?? '',
        descripcion: backendProduct.description ?? undefined,
        estado: 'Disponible',
        cantidad: 1,
        fechaIngreso: backendProduct.createdAt
            ? new Date(backendProduct.createdAt).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
        ubicacion: backendProduct.location?.name ?? undefined,
        proveedor: undefined,
        costo: backendProduct.cost ?? undefined,
        fechaAdquisicion: backendProduct.purchase_date
            ? new Date(backendProduct.purchase_date).toISOString().slice(0, 10)
            : undefined,
        fechaVencimientoGarantia: null,
        vidaUtil: undefined,
        asignadoA: null,
        fechaAsignacion: null,
        prestadoA: null,
        fechaPrestamo: null,
        fechaDevolucion: null,
    } as const;
}

export function useInventory() {
    const { data, error, isLoading, mutate } = useSWR<ApiResponse<any[]>>(
        'http://localhost:3001/api/v1/inventory',
        fetcher
    );

    return {
        inventory: Array.isArray(data?.data) ? data!.data.map(mapBackendToFrontend) : [],
        isLoading,
        isError: error,
        mutate,
    } as const;
}


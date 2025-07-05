// Este tipo representa un item individual en la base de datos o el contexto.
export interface InventoryItem {
    id: number;
    nombre: string;
    marca: string;
    modelo: string;
    numeroSerie: string | null;
    categoria: string;
    descripcion?: string;
    estado: "Disponible" | "Asignado" | "Prestado" | "Retirado" | "En Mantenimiento" | "PENDIENTE_DE_RETIRO";
    cantidad: number;
    fechaIngreso: string;
    ubicacion?: string;
    proveedor?: string;
    costo?: number;
    fechaAdquisicion?: string;
    garantia?: string;
    vidaUtil?: string;
    mantenimiento?: string;
    historialMantenimiento?: { date: string; description: string }[];
    documentosAdjuntos?: { name: string; url: string }[];
    isSerialized?: boolean;
    contratoId?: string | null;
}



// Este tipo representa un usuario.
export interface User {
    id: number;
    nombre: string;
    email: string;
    password?: string;
    rol: "Administrador" | "Editor" | "Lector";
    departamento?: string;
}

// Este es el tipo para nuestra estructura de datos AGRUPADA que usa la tabla.
// Combina la información del producto padre con sus hijos.
export interface GroupedProduct {
    isParent: true;
    product: {
        id: string;
        nombre: string;
        marca: string;
        modelo: string;
        categoria: string;
        isSerialized: boolean;
    };
    summary: {
        total: number;
        disponible: number;
        estados: {
            [key: string]: number;
        };
    };
    children: InventoryItem[];
    highlightedChildId?: string | null;
}

export interface AdvancedFilterState {
    fechaInicio: Date | null;
    fechaFin: Date | null;
    proveedor: string;
    contratoId: string;
}

// Definición de una columna en la tabla de inventario
export interface ColumnDefinition {
    id: string;
    label: string;
    defaultVisible: boolean;
    sortable: boolean;
    type?: 'string' | 'number' | 'date' | 'status';
    fixed?: "start" | "end";
    visible?: boolean;
} 
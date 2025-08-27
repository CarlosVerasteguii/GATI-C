// Nuevo tipo para eventos de historial
export interface HistoryEvent {
    fecha: string;
    usuario: string;
    accion: string;
    detalles: string;
}

// Este tipo representa un item individual en la base de datos o el contexto.
export interface InventoryItem {
    id: number;
    nombre: string;
    marca: string;
    modelo: string;
    numeroSerie: string | null;
    categoria: string;
    descripcion?: string;
    estado: InventoryStatus;
    cantidad: number;
    fechaIngreso: string;
    ubicacion?: string;
    proveedor?: string;
    costo?: number;
    fechaAdquisicion?: string;
    fechaVencimientoGarantia?: string | null; // Formato YYYY-MM-DD
    vidaUtil?: string;
    historial?: HistoryEvent[];
    documentosAdjuntos?: { name: string; url: string }[];
    isSerialized?: boolean;
    contratoId?: string | null;
    asignadoA?: string | null;
    fechaAsignacion?: string | null;
    prestadoA?: string | null;
    fechaPrestamo?: string | null;
    fechaDevolucion?: string | null;
    reactKey?: string;
    isVirtual?: boolean;
    originalId?: number;
}



// Este tipo representa un usuario y debe coincidir 1:1 con el backend.
export interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMINISTRADOR" | "EDITOR" | "LECTOR";
    isActive: boolean;
    lastLoginAt?: string | null;
    trusted_ip?: string | null;
    createdAt: string;
    updatedAt: string;
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
    costoMin: number | null;
    costoMax: number | null;
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

// Tipo para estados de inventario
export type InventoryStatus = "Disponible" | "Asignado" | "Prestado" | "Retirado" | "PENDIENTE_DE_RETIRO";

// Tipo para estados de préstamos
export type LoanStatus = "Activo" | "Devuelto" | "Vencido";

// Tipo para estados de asignaciones
export type AssignmentStatus = "Activo" | "Devuelto";

// Tipo para estados de tareas
export type TaskStatus =
    | "Pendiente"
    | "Aprobado"
    | "Rechazado"
    | "Carga Rápida"
    | "Retiro Rápido"
    | "Edición Masiva"
    | "Asignación Masiva"
    | "Préstamo Masivo"
    | "Retiro Masivo"; 
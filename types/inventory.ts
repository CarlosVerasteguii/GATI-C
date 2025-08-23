// Nuevo tipo para eventos de historial
export interface HistoryEvent {
    date: string;
    user: string;
    action: string;
    details: string;
}

// Este tipo representa un item individual en la base de datos o el contexto.
export interface InventoryItem {
    id: number;
    name: string;
    brand: string;
    model: string;
    serialNumber: string | null;
    category: string;
    description?: string;
    status: InventoryStatus;
    quantity: number;
    entryDate: string;
    location?: string;
    provider?: string;
    cost?: number;
    purchaseDate?: string;
    warrantyExpirationDate?: string | null; // YYYY-MM-DD
    usefulLife?: string;
    history?: HistoryEvent[];
    attachedDocuments?: { name: string; url: string }[];
    isSerialized?: boolean;
    contractId?: string | null;
    assignedTo?: string | null;
    assignmentDate?: string | null;
    lentTo?: string | null;
    loanDate?: string | null;
    returnDate?: string | null;
    reactKey?: string;
    isVirtual?: boolean;
    originalId?: number;
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
        name: string;
        brand: string;
        model: string;
        category: string;
        isSerialized: boolean;
    };
    summary: {
        total: number;
        available: number;
        states: {
            [key: string]: number;
        };
    };
    children: InventoryItem[];
    highlightedChildId?: string | null;
}

export interface AdvancedFilterState {
    startDate: Date | null;
    endDate: Date | null;
    provider: string;
    contractId: string;
    minCost: number | null;
    maxCost: number | null;
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
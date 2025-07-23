"use client"

import React, { createContext, useState, useContext, useEffect, useCallback } from "react"
import type { InventoryItem, User, HistoryEvent } from "@/types/inventory"

// Definición de tipos para el estado de la aplicación
interface AsignadoItem {
  id: number
  articuloId: number // ID del item de inventario original
  nombre: string
  numeroSerie: string | null
  asignadoA: string
  fechaAsignacion: string // YYYY-MM-DD
  estado: "Activo" | "Devuelto"
  notas?: string
  registradoPor?: string
}

interface PrestamoItem {
  id: number
  articuloId: number // ID del item de inventario original
  nombre: string
  numeroSerie: string | null
  prestadoA: string
  fechaPrestamo: string // YYYY-MM-DD
  fechaDevolucion: string // YYYY-MM-DD
  estado: "Activo" | "Devuelto" | "Vencido"
  diasRestantes: number
  notas?: string
  registradoPor?: string
}

interface SolicitudAcceso {
  id: number
  nombre: string
  email: string
  justificacion: string
  fecha: string
  estado: "Pendiente" | "Aprobada" | "Rechazada"
  password?: string // Temporal password storage for approved access requests
}

interface PendingActionRequest {
  id: number
  type:
  | "Creación de Producto"
  | "Edición de Producto"
  | "Duplicación de Producto"
  | "Asignación"
  | "Préstamo"
  | "Retiro de Producto"
  | "Reactivación"
  | "Edición Masiva"
  | "Asignación Masiva"
  | "Préstamo Masivo"
  | "Retiro Masivo"
  requestedBy: string
  date: string
  status: "Pendiente" | "Aprobada" | "Rechazada"
  details: any // Flexible for different action types
  auditLog?: { event: string; user: string; dateTime: string; description: string }[]
}

interface RecentActivity {
  type: string
  description: string
  date: string
  details?: any
}

interface PendingTask {
  id: number
  type:
  | "CARGA"
  | "RETIRO"
  | "ASIGNACION"
  | "PRESTAMO"
  | "Reactivación"
  | "Creación de Producto"
  | "Edición de Producto"
  | "Duplicación de Producto"
  creationDate: string
  createdBy: string
  status: "Pendiente" | "Finalizada" | "Cancelada"
  details: any
  auditLog?: { event: string; user: string; dateTime: string; description: string }[]
}

interface UserColumnPreference {
  page: string
  preferences: { id: string; label: string; visible: boolean }[]
  itemsPerPage?: number
}

// --- Inventory Low Stock Thresholds (Enterprise Ready) ---
/**
 * InventoryLowStockThresholds: Enterprise-ready structure for configurable low stock alerts.
 * - productThresholds: { [productId: number]: number } // Per-product threshold
 * - categoryThresholds: { [category: string]: number } // Per-category threshold
 * - globalThreshold: number // Fallback if no product/category threshold
 *
 * TODO: Add UI for admin configuration and persist thresholds to backend.
 */
export interface InventoryLowStockThresholds {
  productThresholds: { [productId: number]: number };
  categoryThresholds: { [category: string]: number };
  globalThreshold: number;
}

// --- Default thresholds (mock, for demo/testing) ---
const defaultLowStockThresholds: InventoryLowStockThresholds = {
  productThresholds: {
    1: 2, // Laptop de Desarrollo Avanzado
    3: 1, // Monitor UltraSharp
    // ...otros productos
  },
  categoryThresholds: {
    'Laptops': 3,
    'Monitores': 2,
    // ...otras categorías
  },
  globalThreshold: 3,
};

interface AppState {
  user: User | null
  usersData: User[]
  inventoryData: InventoryItem[]
  asignadosData: AsignadoItem[]
  prestamosData: PrestamoItem[]
  solicitudesAcceso: SolicitudAcceso[]
  pendingActionRequests: PendingActionRequest[]
  recentActivities: RecentActivity[]
  tasks: PendingTask[]
  categorias: string[]
  marcas: string[]
  proveedores: string[];
  ubicaciones: string[];
  retirementReasons: string[]
  userColumnPreferences: UserColumnPreference[]
  userTheme?: string // Añadimos el tema del usuario al estado
  error: string | null
  isDragOver: boolean
  isNavigating: boolean
  isUploading: boolean
  successMessage: string | null
  uploadProgress: number
  lowStockThresholds: InventoryLowStockThresholds;
}

// Datos de ejemplo
const defaultUsersData: User[] = [
  { id: 1, nombre: "Carlos Vera", email: "carlos@example.com", password: "password123", rol: "Administrador" },
  { id: 2, nombre: "Ana López", email: "ana@example.com", password: "password123", rol: "Editor" },
  { id: 3, nombre: "Pedro García", email: "pedro@example.com", password: "password123", rol: "Lector" }, // Corregido según PRD
]

const defaultInventoryData: InventoryItem[] = [
  // Laptops
  {
    id: 1,
    nombre: "Laptop de Desarrollo Avanzado",
    marca: "Dell",
    modelo: "XPS 15",
    numeroSerie: "DXPS15-001",
    categoria: "Laptops",
    estado: "Disponible",
    cantidad: 1,
    fechaIngreso: "2023-01-15",
    ubicacion: "Oficina Principal - Piso 2",
    proveedor: "Compudel",
    costo: 2200,
    fechaAdquisicion: "2023-01-10",
    isSerialized: true,
    fechaVencimientoGarantia: "2024-01-15", // Garantía vencida
    historial: [
      {
        fecha: "2023-01-15",
        usuario: "Carlos Vera",
        accion: "Ingreso de Producto",
        detalles: "Nuevo producto agregado al inventario"
      },
      {
        fecha: "2023-03-20",
        usuario: "Ana López",
        accion: "Asignación",
        detalles: "Asignado al departamento de Desarrollo"
      }
    ]
  },
  {
    id: 2,
    nombre: "Laptop de Gerencia",
    marca: "Apple",
    modelo: "MacBook Pro 16",
    numeroSerie: "AMBP16-002",
    categoria: "Laptops",
    estado: "Disponible",
    cantidad: 1,
    fechaIngreso: "2023-03-20",
    ubicacion: "Almacén Central",
    proveedor: "iShop",
    costo: 2500,
    fechaAdquisicion: "2023-03-15",
    isSerialized: true,
    fechaVencimientoGarantia: "2024-09-15", // Próxima a vencer (3 meses desde hoy)
    historial: [
      {
        fecha: "2023-03-20",
        usuario: "Carlos Vera",
        accion: "Ingreso de Producto",
        detalles: "Nuevo MacBook Pro ingresado al inventario"
      },
      {
        fecha: "2023-05-10",
        usuario: "Ana López",
        accion: "Actualización de Estado",
        detalles: "Movido a estado Disponible después de configuración inicial"
      }
    ]
  },
  {
    id: 3,
    nombre: "Estación de Trabajo Móvil",
    marca: "HP",
    modelo: "ZBook Fury G8",
    numeroSerie: "HPZF-003",
    categoria: "Laptops",
    estado: "Disponible",
    cantidad: 1,
    fechaIngreso: "2022-11-05",
    ubicacion: "Soporte Técnico",
    proveedor: "HP Directo",
    costo: 3100,
    fechaAdquisicion: "2022-10-25",
    isSerialized: true,
    fechaVencimientoGarantia: "2026-12-31", // Garantía lejana
    historial: [
      {
        fecha: "2022-11-05",
        usuario: "Carlos Vera",
        accion: "Ingreso de Producto",
        detalles: "Nuevo ZBook Fury G8 ingresado al inventario"
      }
    ]
  },
  {
    id: 4,
    nombre: "Laptop para Viajes",
    marca: "Lenovo",
    modelo: "ThinkPad X1 Carbon",
    numeroSerie: "LTPX1-004",
    categoria: "Laptops",
    estado: "Prestado",
    prestadoA: "Ana Gómez",
    fechaPrestamo: "2024-06-15",
    fechaDevolucion: "2024-06-30",
    cantidad: 1,
    fechaIngreso: "2023-05-10",
    ubicacion: "Oficina Principal - Piso 2",
    proveedor: "Compudel",
    costo: 1800,
    fechaAdquisicion: "2023-05-01",
    isSerialized: true,
    fechaVencimientoGarantia: null, // Sin garantía
  },
  { id: 20, nombre: "Laptop de Desarrollo Avanzado", marca: "Dell", modelo: "XPS 15", numeroSerie: "DXPS15-002", categoria: "Laptops", estado: "Disponible", cantidad: 1, fechaIngreso: "2023-01-15", ubicacion: "Almacén Central", proveedor: "Compudel", costo: 2200, fechaAdquisicion: "2023-01-10", isSerialized: true, fechaVencimientoGarantia: new Date().toISOString().split('T')[0] },

  // Monitores
  { id: 5, nombre: "Monitor Curvo UltraWide", marca: "LG", modelo: "34WN780-B", numeroSerie: "LG34-005", categoria: "Monitores", estado: "Disponible", cantidad: 1, fechaIngreso: "2023-02-01", ubicacion: "Oficina Principal - Piso 1", proveedor: "TecnoMundo", costo: 750, fechaAdquisicion: "2023-01-25", isSerialized: true },
  { id: 6, nombre: "Monitor para Diseño Gráfico 4K", marca: "Dell", modelo: "UltraSharp U2721Q", numeroSerie: "DU27-006", categoria: "Monitores", estado: "Asignado", cantidad: 1, fechaIngreso: "2022-09-15", ubicacion: "Área de Diseño", proveedor: "Compudel", costo: 850, fechaAdquisicion: "2022-09-10", isSerialized: true },
  { id: 7, nombre: "Monitor de Alta Tasa de Refresco", marca: "ASUS", modelo: "ROG Swift PG279Q", numeroSerie: "ASUSROG-007", categoria: "Monitores", estado: "Prestado", prestadoA: "Sofía Castillo", fechaPrestamo: new Date().toISOString().split('T')[0], fechaDevolucion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], cantidad: 1, fechaIngreso: "2023-06-01", ubicacion: "Almacén Central", proveedor: "TecnoMundo", costo: 650, fechaAdquisicion: "2023-05-28", isSerialized: true },

  // Periféricos
  { id: 8, nombre: "Teclado Mecánico Inalámbrico", marca: "Logitech", modelo: "MX Mechanical", numeroSerie: null, categoria: "Periféricos", estado: "Disponible", cantidad: 10, fechaIngreso: "2023-04-10", ubicacion: "Almacén Central", proveedor: "OfficeDepot", costo: 170, fechaAdquisicion: "2023-04-05", isSerialized: false },
  { id: 9, nombre: "Mouse Ergonómico Vertical", marca: "Logitech", modelo: "MX Vertical", numeroSerie: "LOGIMXV-009", categoria: "Periféricos", estado: "Asignado", cantidad: 1, fechaIngreso: "2023-02-20", ubicacion: "Oficina Principal - Piso 2", proveedor: "OfficeDepot", costo: 100, fechaAdquisicion: "2023-02-15", isSerialized: true },
  { id: 10, nombre: "Webcam 4K", marca: "Logitech", modelo: "Brio 4K", numeroSerie: null, categoria: "Periféricos", estado: "Disponible", cantidad: 5, fechaIngreso: "2023-05-30", ubicacion: "Almacén Central", proveedor: "TecnoMundo", costo: 200, fechaAdquisicion: "2023-05-25", isSerialized: false },

  // Servidores y Redes
  { id: 11, nombre: "Servidor de Rack 2U", marca: "Dell", modelo: "PowerEdge R740", numeroSerie: "DPER740-011", categoria: "Servidores", estado: "Retirado", cantidad: 1, fechaIngreso: "2020-05-15", ubicacion: "Data Center A", proveedor: "HP Directo", costo: 5000, fechaAdquisicion: "2020-05-01", isSerialized: true },
  { id: 12, nombre: "Switch Gestionable 48 Puertos", marca: "Cisco", modelo: "Catalyst 2960", numeroSerie: "CISCO2960-012", categoria: "Redes", estado: "Disponible", cantidad: 1, fechaIngreso: "2021-08-10", ubicacion: "Data Center A", proveedor: "TecnoMundo", costo: 1200, fechaAdquisicion: "2021-08-01", isSerialized: true },
  { id: 13, nombre: "Firewall de Próxima Generación", marca: "Palo Alto", modelo: "PA-220", numeroSerie: "PALO-220-013", categoria: "Seguridad", estado: "Disponible", cantidad: 1, fechaIngreso: "2023-07-01", ubicacion: "Data Center B", proveedor: "HP Directo", costo: 900, fechaAdquisicion: "2023-06-20", isSerialized: true },

  // Otros
  { id: 14, nombre: "Proyector Full HD para Sala de Juntas", marca: "Epson", modelo: "PowerLite 1080", numeroSerie: "EPSONPL-014", categoria: "Audiovisual", estado: "Disponible", cantidad: 1, fechaIngreso: "2022-06-10", ubicacion: "Sala de Juntas 1", proveedor: "OfficeDepot", costo: 800, fechaAdquisicion: "2022-06-01", isSerialized: true },
  { id: 15, nombre: "Impresora Multifuncional Láser", marca: "HP", modelo: "LaserJet Pro M428fdw", numeroSerie: "HPLJM-015", categoria: "Impresoras", estado: "PENDIENTE_DE_RETIRO", cantidad: 1, fechaIngreso: "2021-01-20", ubicacion: "Área de Copiado", proveedor: "HP Directo", costo: 450, fechaAdquisicion: "2021-01-15", isSerialized: true },
  { id: 16, nombre: "Tableta Gráfica Profesional", marca: "Wacom", modelo: "Intuos Pro M", numeroSerie: "WIPM-016", categoria: "Periféricos", estado: "Prestado", prestadoA: "Luis Fernández", fechaPrestamo: "2024-07-01", fechaDevolucion: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], cantidad: 1, fechaIngreso: "2023-08-01", ubicacion: "Área de Diseño", proveedor: "TecnoMundo", costo: 380, fechaAdquisicion: "2023-07-25", isSerialized: true },
  { id: 17, nombre: "Docking Station USB-C", marca: "Dell", modelo: "WD19S", numeroSerie: null, categoria: "Accesorios", estado: "Disponible", cantidad: 20, fechaIngreso: "2023-01-15", ubicacion: "Almacén Central", proveedor: "Compudel", costo: 250, fechaAdquisicion: "2023-01-10", isSerialized: false },
  { id: 18, nombre: "Router Wi-Fi Mesh (Pack de 3)", marca: "Google", modelo: "Nest Wifi", numeroSerie: null, categoria: "Redes", estado: "Disponible", cantidad: 2, fechaIngreso: "2023-09-01", ubicacion: "Almacén Central", proveedor: "iShop", costo: 300, fechaAdquisicion: "2023-08-20", isSerialized: false },
  { id: 19, nombre: "Lector de Código de Barras", marca: "Zebra", modelo: "DS2208", numeroSerie: null, categoria: "Accesorios", estado: "Disponible", cantidad: 8, fechaIngreso: "2022-12-10", ubicacion: "Almacén de Activos", proveedor: "Compudel", costo: 150, fechaAdquisicion: "2022-12-01", isSerialized: false }
];

const defaultAsignadosData: AsignadoItem[] = [
  {
    id: 1,
    articuloId: 3,
    nombre: "Teclado Mecánico HyperX",
    numeroSerie: "HX-KB7RD2-US/RD",
    asignadoA: "Juan Pérez",
    fechaAsignacion: "2023-03-10",
    estado: "Activo",
    notas: "Asignado para puesto de desarrollo.",
    registradoPor: "Carlos Vera",
  },
  {
    id: 2,
    articuloId: 11,
    nombre: "Laptop Dell XPS 15",
    numeroSerie: "SN-XPS15-002",
    asignadoA: "María García",
    fechaAsignacion: "2023-01-20",
    estado: "Activo",
    notas: "Laptop principal para gerente de proyectos.",
    registradoPor: "Carlos Vera",
  },
]

const defaultPrestamosData: PrestamoItem[] = [
  {
    id: 1,
    articuloId: 4,
    nombre: "Mouse Logitech MX Master 3",
    numeroSerie: "910-005647",
    prestadoA: "Laura Torres",
    fechaPrestamo: "2023-04-05",
    fechaDevolucion: "2024-07-15",
    estado: "Activo",
    diasRestantes: 20,
    notas: "Préstamo temporal para trabajo remoto.",
    registradoPor: "Ana López",
  },
  {
    id: 2,
    articuloId: 12,
    nombre: "Laptop Dell XPS 15",
    numeroSerie: "SN-XPS15-003",
    prestadoA: "Roberto Fernández",
    fechaPrestamo: "2024-06-01",
    fechaDevolucion: "2024-06-30",
    estado: "Activo",
    diasRestantes: 5,
    notas: "Para capacitación externa.",
    registradoPor: "Ana López",
  },
]

const defaultPendingTasksData: PendingTask[] = [
  {
    id: 1,
    type: "CARGA",
    creationDate: "2024-06-15T10:00:00Z",
    createdBy: "Usuario IP Confiable 1",
    status: "Pendiente",
    details: {
      productName: "Teclado Inalámbrico",
      brand: "Logitech",
      model: "K380",
      category: "Periféricos",
      description: "Teclado compacto multidispositivo.",
      quantity: 5,
      serialNumbers: [],
    },
    auditLog: [
      {
        event: "CREACIÓN",
        user: "Usuario IP Confiable 1",
        dateTime: "2024-06-15T10:00:00Z",
        description: "Tarea de carga creada desde IP de confianza.",
      },
    ],
  },
  {
    id: 2,
    type: "RETIRO",
    creationDate: "2024-06-16T14:30:00Z",
    createdBy: "Usuario IP Confiable 2",
    status: "Pendiente",
    details: {
      itemsImplicados: [
        {
          id: 13,
          name: "Laptop Dell XPS 15",
          serial: "SN-XPS15-004",
          model: "XPS 15",
          brand: "Dell",
          category: "Laptops",
          quantity: 1,
          originalId: 13,
          fechaIngreso: "2023-01-15",
          description: "Laptop de alto rendimiento para uso profesional.",
        },
      ],
      reason: "Fin de vida útil",
    },
    auditLog: [
      {
        event: "CREACIÓN",
        user: "Usuario IP Confiable 2",
        dateTime: "2024-06-16T14:30:00Z",
        description: "Tarea de retiro creada desde IP de confianza.",
      },
    ],
  },
  {
    id: 3,
    type: "ASIGNACION",
    creationDate: "2024-06-17T09:15:00Z",
    createdBy: "Ana López",
    status: "Pendiente",
    details: {
      productId: 8,
      productName: "Cámara Web Logitech C920",
      productSerialNumber: null,
      assignedTo: "Nuevo Empleado",
      notes: "Para estación de trabajo de nuevo ingreso.",
    },
    auditLog: [
      {
        event: "CREACIÓN",
        user: "Ana López",
        dateTime: "2024-06-17T09:15:00Z",
        description: "Solicitud de asignación creada por Editor.",
      },
    ],
  },
  {
    id: 4,
    type: "PRESTAMO",
    creationDate: "2024-06-18T11:00:00Z",
    createdBy: "Pedro García",
    status: "Pendiente",
    details: {
      productId: 10,
      productName: "Proyector Epson PowerLite",
      productSerialNumber: null,
      lentToName: "Sala de Conferencias A",
      returnDate: "2024-06-25",
      notes: "Para presentación semanal.",
    },
    auditLog: [
      {
        event: "CREACIÓN",
        user: "Pedro García",
        dateTime: "2024-06-18T11:00:00Z",
        description: "Solicitud de préstamo creada por Lector.",
      },
    ],
  },
]

const defaultInitialState: AppState = {
  user: null,
  usersData: defaultUsersData,
  inventoryData: defaultInventoryData,
  asignadosData: defaultAsignadosData,
  prestamosData: defaultPrestamosData,
  solicitudesAcceso: [],
  pendingActionRequests: [],
  recentActivities: [],
  tasks: defaultPendingTasksData,
  categorias: [
    "Laptops",
    "Monitores",
    "Periféricos",
    "Servidores",
    "Redes",
    "Impresoras",
    "Almacenamiento",
    "Proyectores",
  ],
  marcas: [],
  proveedores: [],
  ubicaciones: [],
  retirementReasons: ["Fin de vida útil", "Dañado sin reparación"],
  userColumnPreferences: [],
  error: null,
  isDragOver: false,
  isNavigating: false,
  isUploading: false,
  successMessage: null,
  uploadProgress: 0,
  lowStockThresholds: defaultLowStockThresholds,
}

// Definición de tipos para las acciones
type AppAction =
  | { type: 'UPDATE_INVENTORY'; payload: InventoryItem[] }
  | { type: 'UPDATE_INVENTORY_ITEM_STATUS'; payload: { id: number; status: string } }
  | { type: 'ADD_RECENT_ACTIVITY'; payload: RecentActivity }
  | { type: 'UPDATE_PENDING_TASK'; payload: { id: number; updates: Partial<PendingTask> } }
  | { type: 'UPDATE_USER_COLUMN_PREFERENCES'; payload: { userId: number; pageId: string; columns: string[]; itemsPerPage?: number } }
  | { type: 'UPDATE_USER_THEME'; payload: string }
  | { type: 'SET_MARCAS'; payload: string[] }
  | { type: 'SET_PROVEEDORES'; payload: string[] }
  | { type: 'SET_UBICACIONES'; payload: string[] }
  | { type: 'ADD_PENDING_REQUEST'; payload: PendingActionRequest }
  | { type: 'ADD_INVENTORY_ITEM'; payload: InventoryItem }
  | { type: 'ADD_HISTORY_EVENT'; payload: { itemId: number; event: HistoryEvent } };

// Definición de la interfaz para el valor del contexto
interface AppContextType {
  state: AppState
  dispatch: (action: AppAction) => void
  setUser: (user: User | null) => void
  updateInventory: (inventory: InventoryItem[]) => void
  addInventoryItem: (item: InventoryItem) => void
  updateInventoryItem: (id: number, updates: Partial<InventoryItem>) => void
  liberarAsignacion: (itemId: number) => void
  updateInventoryItemStatus: (id: number, status: "Disponible" | "Asignado" | "Prestado" | "Retirado" | "PENDIENTE_DE_RETIRO") => void
  removeInventoryItem: (id: number) => void
  updateAsignados: (asignados: AsignadoItem[]) => void
  addAssignment: (assignment: AsignadoItem) => void
  removeAssignment: (id: number) => void
  updateAssignmentStatus: (id: number, status: AsignadoItem["estado"]) => void
  updatePrestamos: (prestamos: PrestamoItem[]) => void
  addLoan: (loan: PrestamoItem) => void
  removeLoan: (id: number) => void
  updateLoanStatus: (id: number, status: PrestamoItem["estado"]) => void
  updateSolicitudes: (solicitud: SolicitudAcceso[]) => void
  addSolicitudAcceso: (solicitud: SolicitudAcceso) => void
  updateSolicitudStatus: (id: number, status: SolicitudAcceso["estado"]) => void
  updatePendingActionRequests: (requests: PendingActionRequest[]) => void
  addPendingRequest: (request: PendingActionRequest) => void
  addRecentActivity: (activity: RecentActivity) => void
  updateUserInUsersData: (userId: number, updates: Partial<User>) => void
  addUserToUsersData: (user: User) => void
  addPendingTask: (task: PendingTask) => void
  updatePendingTask: (taskId: number, updates: Partial<PendingTask>) => void
  updateUserColumnPreferences: (userId: number, pageId: string, columns: string[], itemsPerPage?: number) => void
  updateUserTheme: (theme: string) => void
  updateMarcas: (marcas: string[]) => void
  updateProveedores: (proveedores: string[]) => void;
  updateUbicaciones: (ubicaciones: string[]) => void;
  addHistoryEvent: (itemId: number, event: HistoryEvent) => void;
  devolverPrestamo: (itemId: number) => void;
  getEffectiveLowStockThreshold: (product: InventoryItem) => number;
  // --- Enterprise: Funciones para editar umbrales de inventario bajo ---
  /**
   * setProductLowStockThreshold: Define o actualiza el umbral de inventario bajo para un producto.
   * Si value es null, elimina el umbral del producto.
   * Valida que el valor sea positivo.
   */
  setProductLowStockThreshold: (productId: number, value: number | null) => void;
  /**
   * setCategoryLowStockThreshold: Define o actualiza el umbral de inventario bajo para una categoría.
   * Si value es null, elimina el umbral de la categoría.
   * Valida que el valor sea positivo.
   */
  setCategoryLowStockThreshold: (category: string, value: number | null) => void;
  /**
   * setGlobalLowStockThreshold: Define el umbral global de inventario bajo.
   * Valida que el valor sea positivo.
   */
  setGlobalLowStockThreshold: (value: number) => void;
  /**
   * cleanOrphanThresholds: Elimina umbrales de productos/categorías que ya no existen.
   * Se recomienda llamar tras eliminar productos/categorías.
   */
  cleanOrphanThresholds: () => void;
}

// Creación del contexto
const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("gati-c-app-state");
      // Si existe un estado guardado, úsalo. Punto.
      if (savedState) {
        try {
          return JSON.parse(savedState);
        } catch (e) {
          console.error("Error parsing saved state, falling back to default.", e);
          // Si el estado guardado está corrupto, volvemos al por defecto.
          localStorage.removeItem("gati-c-app-state");
          return defaultInitialState;
        }
      }
    }
    // Si no hay estado guardado, usa el estado por defecto.
    return defaultInitialState;
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gati-c-app-state", JSON.stringify(state))
    }
  }, [state])

  const dispatch = useCallback((action: AppAction) => {
    switch (action.type) {
      case 'UPDATE_INVENTORY':
        setState(prev => ({ ...prev, inventoryData: action.payload }));
        break;
      case 'UPDATE_INVENTORY_ITEM_STATUS':
        setState(prev => ({
          ...prev,
          inventoryData: prev.inventoryData.map(item =>
            item.id === action.payload.id
              ? { ...item, estado: action.payload.status as any }
              : item
          ),
        }));
        break;
      case 'ADD_INVENTORY_ITEM':
        setState(prev => ({
          ...prev,
          inventoryData: [...prev.inventoryData, action.payload]
        }));
        break;
      case 'ADD_RECENT_ACTIVITY':
        setState(prev => ({
          ...prev,
          recentActivities: [action.payload, ...prev.recentActivities].slice(0, 50),
        }));
        break;
      case 'UPDATE_PENDING_TASK':
        setState(prev => ({
          ...prev,
          tasks: prev.tasks.map(task =>
            task.id === action.payload.id
              ? { ...task, ...action.payload.updates }
              : task
          ),
        }));
        break;
      case 'UPDATE_USER_COLUMN_PREFERENCES':
        setState(prev => {
          const existingPreference = prev.userColumnPreferences.find(p => p.page === action.payload.pageId);
          if (existingPreference) {
            return {
              ...prev,
              userColumnPreferences: prev.userColumnPreferences.map(p =>
                p.page === action.payload.pageId
                  ? {
                    ...p,
                    preferences: p.preferences.map(col => ({
                      ...col,
                      visible: action.payload.columns.includes(col.id),
                    })),
                  }
                  : p
              ),
            };
          }
          return prev;
        });
        break;
      case 'UPDATE_USER_THEME':
        setState(prev => ({
          ...prev,
          userTheme: action.payload
        }));
        break;
      case 'SET_MARCAS':
        setState(prev => ({
          ...prev,
          marcas: action.payload
        }));
        break;
      case 'SET_PROVEEDORES':
        setState(prev => ({
          ...prev,
          proveedores: action.payload
        }));
        break;
      case 'SET_UBICACIONES':
        setState(prev => ({
          ...prev,
          ubicaciones: action.payload
        }));
        break;
      case 'ADD_PENDING_REQUEST':
        setState(prev => ({
          ...prev,
          pendingActionRequests: [...prev.pendingActionRequests, action.payload]
        }));
        break;
      case 'ADD_HISTORY_EVENT':
        setState(prev => ({
          ...prev,
          inventoryData: prev.inventoryData.map(item =>
            item.id === action.payload.itemId
              ? {
                ...item,
                historial: [...(item.historial || []), action.payload.event]
              }
              : item
          ),
        }));
        break;
      default:
        console.error('Unknown action type');
    }
  }, []);

  const setUser = useCallback((user: User | null) => {
    setState((prevState) => ({ ...prevState, user }))
  }, [])

  const updateInventory = useCallback((inventory: InventoryItem[]) => {
    setState((prevState) => ({ ...prevState, inventoryData: inventory }))
  }, [])

  const addInventoryItem = useCallback((item: InventoryItem) => {
    // Prepara el evento de historial inicial
    const creationEvent: HistoryEvent = {
      fecha: new Date().toISOString(),
      usuario: state.user?.nombre || 'Sistema', // Usar el nombre del usuario actual
      accion: 'Creación',
      detalles: `El activo fue creado en el sistema.`
    };

    // Añade el evento al historial del nuevo ítem
    const itemWithHistory = {
      ...item,
      historial: [creationEvent]
    };

    dispatch({ type: 'ADD_INVENTORY_ITEM', payload: itemWithHistory });
  }, [state.user, dispatch]);

  const updateInventoryItem = useCallback((id: number, updates: Partial<InventoryItem>) => {
    setState((prevState) => ({
      ...prevState,
      inventoryData: prevState.inventoryData.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }))
  }, [])

  const removeInventoryItem = useCallback((id: number) => {
    setState((prevState) => ({
      ...prevState,
      inventoryData: prevState.inventoryData.filter((item) => item.id !== id),
    }))
  }, [])

  const updateAsignados = useCallback((asignados: AsignadoItem[]) => {
    setState((prevState) => ({ ...prevState, asignadosData: asignados }))
  }, [])

  const addAssignment = useCallback((assignment: AsignadoItem) => {
    setState((prevState) => ({ ...prevState, asignadosData: [...prevState.asignadosData, assignment] }))
  }, [])

  const removeAssignment = useCallback((id: number) => {
    setState((prevState) => ({
      ...prevState,
      asignadosData: prevState.asignadosData.filter((item) => item.id !== id),
    }))
  }, [])

  const updateAssignmentStatus = useCallback((id: number, status: AsignadoItem["estado"]) => {
    setState((prevState) => ({
      ...prevState,
      asignadosData: prevState.asignadosData.map((item) => (item.id === id ? { ...item, estado: status } : item)),
    }))
  }, [])

  const updatePrestamos = useCallback((prestamos: PrestamoItem[]) => {
    setState((prevState) => ({ ...prevState, prestamosData: prestamos }))
  }, [])

  const addLoan = useCallback((loan: PrestamoItem) => {
    setState((prevState) => ({ ...prevState, prestamosData: [...prevState.prestamosData, loan] }))
  }, [])

  const removeLoan = useCallback((id: number) => {
    setState((prevState) => ({
      ...prevState,
      prestamosData: prevState.prestamosData.filter((item) => item.id !== id),
    }))
  }, [])

  const updateLoanStatus = useCallback((id: number, status: PrestamoItem["estado"]) => {
    setState((prevState) => ({
      ...prevState,
      prestamosData: prevState.prestamosData.map((item) => (item.id === id ? { ...item, estado: status } : item)),
    }))
  }, [])

  const updateSolicitudes = useCallback((solicitudes: SolicitudAcceso[]) => {
    setState((prevState) => ({ ...prevState, solicitudesAcceso: solicitudes }))
  }, [])

  const addSolicitudAcceso = useCallback((solicitud: SolicitudAcceso) => {
    setState((prevState) => ({ ...prevState, solicitudesAcceso: [...prevState.solicitudesAcceso, solicitud] }))
  }, [])

  const updateSolicitudStatus = useCallback((id: number, status: SolicitudAcceso["estado"]) => {
    setState((prevState) => ({
      ...prevState,
      solicitudesAcceso: prevState.solicitudesAcceso.map((solicitud) =>
        solicitud.id === id ? { ...solicitud, estado: status } : solicitud
      ),
    }))
  }, [])

  const updatePendingActionRequests = useCallback((requests: PendingActionRequest[]) => {
    setState((prevState) => ({ ...prevState, pendingActionRequests: requests }))
  }, [])

  const addPendingRequest = useCallback((request: PendingActionRequest) => {
    setState((prevState) => ({ ...prevState, pendingActionRequests: [...prevState.pendingActionRequests, request] }))
  }, [])

  const addRecentActivity = useCallback((activity: RecentActivity) => {
    setState((prevState) => ({
      ...prevState,
      recentActivities: [activity, ...prevState.recentActivities].slice(0, 50), // Keep last 50 activities
    }))
  }, [])

  const updateUserInUsersData = useCallback((userId: number, updates: Partial<User>) => {
    setState((prevState) => ({
      ...prevState,
      usersData: prevState.usersData.map((user) => (user.id === userId ? { ...user, ...updates } : user)),
    }))
  }, [])

  const addUserToUsersData = useCallback((user: User) => {
    setState((prevState) => ({
      ...prevState,
      usersData: [...prevState.usersData, user],
    }))
  }, [])

  const addPendingTask = useCallback((task: PendingTask) => {
    setState((prevState) => ({ ...prevState, tasks: [...prevState.tasks, task] }))
  }, [])

  const updatePendingTask = useCallback((taskId: number, updates: Partial<PendingTask>) => {
    setState((prevState) => ({
      ...prevState,
      tasks: prevState.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
    }))
  }, [])

  const updateUserColumnPreferences = useCallback(
    (userId: number, pageId: string, columns: string[], itemsPerPage?: number) => {
      setState((prevState) => {
        // Verificar si ya existe una preferencia para esta página
        const existingPrefIndex = prevState.userColumnPreferences.findIndex(pref => pref.page === pageId);

        if (existingPrefIndex !== -1) {
          // Actualizar preferencia existente
          const updatedPreferences = [...prevState.userColumnPreferences];
          updatedPreferences[existingPrefIndex] = {
            ...updatedPreferences[existingPrefIndex],
            preferences: updatedPreferences[existingPrefIndex].preferences.map(p => ({
              ...p,
              visible: columns.includes(p.id)
            })),
            itemsPerPage: itemsPerPage !== undefined ? itemsPerPage : updatedPreferences[existingPrefIndex].itemsPerPage
          };

          return {
            ...prevState,
            userColumnPreferences: updatedPreferences
          };
        } else {
          // Crear nueva preferencia
          const allColumnsForPage = pageId === "inventario"
            ? [
              { id: "nombre", label: "Nombre", visible: true },
              { id: "marca", label: "Marca", visible: true },
              { id: "modelo", label: "Modelo", visible: true },
              { id: "numeroSerie", label: "N/S", visible: true },
              { id: "categoria", label: "Categoría", visible: true },
              { id: "estado", label: "Estado", visible: true },
              { id: "proveedor", label: "Proveedor", visible: false },
              { id: "fechaAdquisicion", label: "Fecha Adquisición", visible: false },
              { id: "contratoId", label: "Contrato ID", visible: false },
              { id: "asignadoA", label: "Asignado A", visible: false },
              { id: "fechaAsignacion", label: "Fecha Asignación", visible: false }
            ].map(col => ({
              ...col,
              visible: columns.includes(col.id)
            }))
            : columns.map(column => ({ id: column, label: column, visible: true }));

          return {
            ...prevState,
            userColumnPreferences: [
              ...prevState.userColumnPreferences,
              {
                page: pageId,
                preferences: allColumnsForPage,
                itemsPerPage
              }
            ]
          };
        }
      });
    },
    []
  )

  const updateUserTheme = useCallback((theme: string) => {
    setState((prevState) => ({
      ...prevState,
      userTheme: theme
    }));
  }, []);

  const updateMarcas = useCallback((marcas: string[]) => {
    dispatch({ type: 'SET_MARCAS', payload: marcas });
  }, [dispatch]);

  const updateProveedores = useCallback((proveedores: string[]) => {
    dispatch({ type: 'SET_PROVEEDORES', payload: proveedores });
  }, [dispatch]);

  const updateUbicaciones = useCallback((ubicaciones: string[]) => {
    dispatch({ type: 'SET_UBICACIONES', payload: ubicaciones });
  }, [dispatch]);

  const addHistoryEvent = useCallback((itemId: number, event: HistoryEvent) => {
    dispatch({ type: 'ADD_HISTORY_EVENT', payload: { itemId, event } });
  }, [dispatch]);

  const liberarAsignacion = useCallback((itemId: number) => {
    dispatch({
      type: 'UPDATE_INVENTORY_ITEM_STATUS',
      payload: { id: itemId, status: 'Disponible' }
    });

    addHistoryEvent(itemId, {
      fecha: new Date().toISOString(),
      usuario: state.user?.nombre || 'Sistema',
      accion: 'Liberación',
      detalles: 'El activo ha sido devuelto al stock.'
    });
  }, [dispatch, state.user, addHistoryEvent])

  const devolverPrestamo = useCallback((itemId: number) => {
    // 1. Actualizar el estado en la lista principal de inventario
    updateInventoryItem(itemId, {
      estado: "Disponible",
      prestadoA: null,
      fechaPrestamo: null,
      fechaDevolucion: null
    });

    // 2. Actualizar el estado en la lista separada de préstamos
    const activeLoan = state.prestamosData.find(loan => loan.articuloId === itemId && loan.estado === "Activo");
    if (activeLoan) {
      updateLoanStatus(activeLoan.id, "Devuelto");
    }

    // 3. Registrar el evento en el historial
    addHistoryEvent(itemId, {
      fecha: new Date().toISOString(),
      usuario: state.user?.nombre || 'Sistema',
      accion: 'Devolución de Préstamo',
      detalles: 'El activo ha sido devuelto al stock.'
    });
  }, [state.user, state.prestamosData, updateInventoryItem, updateLoanStatus, addHistoryEvent]);

  /**
   * getEffectiveLowStockThreshold: Returns the low stock threshold for a product.
   * Priority: productThresholds > categoryThresholds > globalThreshold
   * @param product InventoryItem
   */
  const getEffectiveLowStockThreshold = useCallback((product: InventoryItem): number => {
    if (state.lowStockThresholds.productThresholds[product.id] !== undefined) {
      return state.lowStockThresholds.productThresholds[product.id];
    }
    if (product.categoria && state.lowStockThresholds.categoryThresholds[product.categoria] !== undefined) {
      return state.lowStockThresholds.categoryThresholds[product.categoria];
    }
    return state.lowStockThresholds.globalThreshold;
  }, [state.lowStockThresholds]);

  // --- Enterprise: Funciones para editar umbrales de inventario bajo ---
  /**
   * setProductLowStockThreshold: Define o actualiza el umbral de inventario bajo para un producto.
   * Si value es null, elimina el umbral del producto.
   * Valida que el valor sea positivo.
   */
  const setProductLowStockThreshold = useCallback((productId: number, value: number | null) => {
    setState(prev => {
      const newThresholds = { ...prev.lowStockThresholds.productThresholds };
      if (value === null) {
        delete newThresholds[productId];
      } else if (value > 0) {
        newThresholds[productId] = value;
      }
      return {
        ...prev,
        lowStockThresholds: {
          ...prev.lowStockThresholds,
          productThresholds: newThresholds,
        },
      };
    });
  }, []);

  /**
   * setCategoryLowStockThreshold: Define o actualiza el umbral de inventario bajo para una categoría.
   * Si value es null, elimina el umbral de la categoría.
   * Valida que el valor sea positivo.
   */
  const setCategoryLowStockThreshold = useCallback((category: string, value: number | null) => {
    setState(prev => {
      const newThresholds = { ...prev.lowStockThresholds.categoryThresholds };
      if (value === null) {
        delete newThresholds[category];
      } else if (value > 0) {
        newThresholds[category] = value;
      }
      return {
        ...prev,
        lowStockThresholds: {
          ...prev.lowStockThresholds,
          categoryThresholds: newThresholds,
        },
      };
    });
  }, []);

  /**
   * setGlobalLowStockThreshold: Define el umbral global de inventario bajo.
   * Valida que el valor sea positivo.
   */
  const setGlobalLowStockThreshold = useCallback((value: number) => {
    if (value > 0) {
      setState(prev => ({
        ...prev,
        lowStockThresholds: {
          ...prev.lowStockThresholds,
          globalThreshold: value,
        },
      }));
    }
  }, []);

  /**
   * cleanOrphanThresholds: Elimina umbrales de productos/categorías que ya no existen.
   * Se recomienda llamar tras eliminar productos/categorías.
   */
  const cleanOrphanThresholds = useCallback(() => {
    setState(prev => {
      const validProductIds = new Set(prev.inventoryData.map(item => item.id));
      const validCategories = new Set(prev.categorias);
      const cleanedProductThresholds = Object.fromEntries(
        Object.entries(prev.lowStockThresholds.productThresholds).filter(([id]) => validProductIds.has(Number(id)))
      );
      const cleanedCategoryThresholds = Object.fromEntries(
        Object.entries(prev.lowStockThresholds.categoryThresholds).filter(([cat]) => validCategories.has(cat))
      );
      return {
        ...prev,
        lowStockThresholds: {
          ...prev.lowStockThresholds,
          productThresholds: cleanedProductThresholds,
          categoryThresholds: cleanedCategoryThresholds,
        },
      };
    });
  }, []);
  // TODO: Agregar persistencia, historial de cambios y validación de roles en el futuro.

  // Efecto para inicializar marcas y proveedores desde los datos de inventario
  useEffect(() => {
    const allMarcas = [...new Set(state.inventoryData.map(item => item.marca))];
    updateMarcas(allMarcas);

    const allProveedores = [...new Set(state.inventoryData.map(item => item.proveedor).filter(Boolean) as string[])];
    updateProveedores(allProveedores);

    const allUbicaciones = [...new Set(state.inventoryData.map(item => item.ubicacion).filter(Boolean) as string[])];
    updateUbicaciones(allUbicaciones);

  }, [state.inventoryData, updateMarcas, updateProveedores, updateUbicaciones]);

  const value = {
    state,
    dispatch,
    setUser,
    updateInventory,
    addInventoryItem,
    updateInventoryItem,
    liberarAsignacion,
    updateInventoryItemStatus: (id: number, status: "Disponible" | "Asignado" | "Prestado" | "Retirado" | "PENDIENTE_DE_RETIRO") => {
      const item = state.inventoryData.find(i => i.id === id)
      if (item) {
        updateInventoryItem(id, { estado: status })
      }
    },
    removeInventoryItem,
    updateAsignados,
    addAssignment,
    removeAssignment,
    updateAssignmentStatus,
    updatePrestamos,
    addLoan,
    removeLoan,
    updateLoanStatus,
    updateSolicitudes,
    addSolicitudAcceso,
    updateSolicitudStatus,
    updatePendingActionRequests,
    addPendingRequest,
    addRecentActivity,
    updateUserInUsersData,
    addUserToUsersData,
    addPendingTask,
    updatePendingTask,
    updateUserColumnPreferences,
    updateUserTheme,
    updateMarcas,
    updateProveedores,
    updateUbicaciones,
    addHistoryEvent,
    devolverPrestamo,
    getEffectiveLowStockThreshold,
    // --- Enterprise: Funciones para editar umbrales de inventario bajo ---
    /**
     * setProductLowStockThreshold: Define o actualiza el umbral de inventario bajo para un producto.
     * Si value es null, elimina el umbral del producto.
     * Valida que el valor sea positivo.
     */
    setProductLowStockThreshold,
    /**
     * setCategoryLowStockThreshold: Define o actualiza el umbral de inventario bajo para una categoría.
     * Si value es null, elimina el umbral de la categoría.
     * Valida que el valor sea positivo.
     */
    setCategoryLowStockThreshold,
    /**
     * setGlobalLowStockThreshold: Define el umbral global de inventario bajo.
     * Valida que el valor sea positivo.
     */
    setGlobalLowStockThreshold,
    /**
     * cleanOrphanThresholds: Elimina umbrales de productos/categorías que ya no existen.
     * Se recomienda llamar tras eliminar productos/categorías.
     */
    cleanOrphanThresholds,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppContextProvider")
  }
  return context
}

// Keep backward-compatibility with older imports
export { AppContextProvider as AppProvider }

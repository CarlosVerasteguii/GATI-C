
"use client"

import React, { createContext, useState, useContext, useEffect, useCallback } from "react"

// Definición de tipos para el estado de la aplicación
interface InventoryItem {
  id: number
  nombre: string
  marca: string
  modelo: string
  categoria: string
  descripcion?: string
  estado: "Disponible" | "Asignado" | "Prestado" | "Retirado" | "En Mantenimiento" | "PENDIENTE_DE_RETIRO"
  cantidad: number
  numeroSerie: string | null
  fechaIngreso: string // YYYY-MM-DD
  ubicacion?: string
  proveedor?: string
  costo?: number
  fechaCompra?: string
  garantia?: string
  vidaUtil?: string
  mantenimiento?: string
  historialMantenimiento?: { date: string; description: string }[]
  documentosAdjuntos?: { name: string; url: string }[]
}

interface AsignadoItem {
  id: number
  articuloId: number // ID del item de inventario original
  articuloNombre: string
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
  articulo: string
  numeroSerie: string | null
  prestadoA: string
  fechaPrestamo: string // YYYY-MM-DD
  fechaDevolucion: string // YYYY-MM-DD
  estado: "Activo" | "Devuelto" | "Vencido"
  diasRestantes: number
  notas?: string
  registradoPor?: string
}

interface User {
  id: number
  nombre: string
  email: string
  password?: string // Should not be stored in client-side state normally
  rol: "Administrador" | "Editor" | "Lector" // Corregido según PRD
  departamento?: string
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

interface AppState {
  user: User | null
  usersData: User[]
  inventoryData: InventoryItem[]
  asignadosData: AsignadoItem[]
  prestamosData: PrestamoItem[]
  solicitudesAcceso: SolicitudAcceso[]
  pendingActionRequests: PendingActionRequest[]
  recentActivities: RecentActivity[]
  pendingTasksData: PendingTask[]
  categorias: string[]
  marcas: string[]
  retirementReasons: string[]
  userColumnPreferences: UserColumnPreference[]
  userTheme?: string // Añadimos el tema del usuario al estado
}

// Datos de ejemplo
const defaultUsersData: User[] = [
  { id: 1, nombre: "Carlos Vera", email: "carlos@example.com", password: "password123", rol: "Administrador" },
  { id: 2, nombre: "Ana López", email: "ana@example.com", password: "password123", rol: "Editor" },
  { id: 3, nombre: "Pedro García", email: "pedro@example.com", password: "password123", rol: "Lector" }, // Corregido según PRD
]

const defaultInventoryData: InventoryItem[] = [
  {
    id: 1,
    nombre: "Laptop Dell XPS 15",
    marca: "Dell",
    modelo: "XPS 15",
    categoria: "Laptops",
    estado: "Disponible",
    cantidad: 5,
    numeroSerie: null,
    fechaIngreso: "2023-01-15",
    descripcion: "Laptop de alto rendimiento para uso profesional.",
  },
  {
    id: 2,
    nombre: "Monitor LG UltraWide",
    marca: "LG",
    modelo: "34WN780-B",
    categoria: "Monitores",
    estado: "Disponible",
    cantidad: 10,
    numeroSerie: null,
    fechaIngreso: "2023-02-01",
    descripcion: "Monitor ultrawide para productividad y multitarea.",
  },
  {
    id: 3,
    nombre: "Teclado Mecánico HyperX",
    marca: "HyperX",
    modelo: "Alloy Origins",
    categoria: "Periféricos",
    estado: "Asignado",
    cantidad: 1,
    numeroSerie: "HX-KB7RD2-US/RD",
    fechaIngreso: "2023-03-10",
    descripcion: "Teclado mecánico con switches rojos.",
  },
  {
    id: 4,
    nombre: "Mouse Logitech MX Master 3",
    marca: "Logitech",
    modelo: "MX Master 3",
    categoria: "Periféricos",
    estado: "Prestado",
    cantidad: 1,
    numeroSerie: "910-005647",
    fechaIngreso: "2023-04-05",
    descripcion: "Mouse ergonómico avanzado para productividad.",
  },
  {
    id: 5,
    nombre: "Servidor Dell PowerEdge R740",
    marca: "Dell",
    modelo: "PowerEdge R740",
    categoria: "Servidores",
    estado: "Retirado",
    cantidad: 1,
    numeroSerie: "SN-R740-001",
    fechaIngreso: "2022-11-20",
    descripcion: "Servidor de rack para centro de datos.",
  },
  {
    id: 6,
    nombre: "Router Wi-Fi TP-Link",
    marca: "TP-Link",
    modelo: "Archer AX50",
    categoria: "Redes",
    estado: "En Mantenimiento",
    cantidad: 1,
    numeroSerie: "AX50-SN-001",
    fechaIngreso: "2023-05-12",
    descripcion: "Router Wi-Fi 6 de doble banda.",
  },
  {
    id: 7,
    nombre: "Impresora Multifuncional HP",
    marca: "HP",
    modelo: "OfficeJet Pro 9015",
    categoria: "Impresoras",
    estado: "Disponible",
    cantidad: 3,
    numeroSerie: null,
    fechaIngreso: "2023-06-01",
    descripcion: "Impresora multifuncional para oficina.",
  },
  {
    id: 8,
    nombre: "Cámara Web Logitech C920",
    marca: "Logitech",
    modelo: "C920",
    categoria: "Periféricos",
    estado: "Disponible",
    cantidad: 7,
    numeroSerie: null,
    fechaIngreso: "2023-07-20",
    descripcion: "Cámara web Full HD para videollamadas.",
  },
  {
    id: 9,
    nombre: "Disco Duro Externo Seagate",
    marca: "Seagate",
    modelo: "Expansion 2TB",
    categoria: "Almacenamiento",
    estado: "Disponible",
    cantidad: 12,
    numeroSerie: null,
    fechaIngreso: "2023-08-01",
    descripcion: "Disco duro externo USB 3.0 de 2TB.",
  },
  {
    id: 10,
    nombre: "Proyector Epson PowerLite",
    marca: "Epson",
    modelo: "1781W",
    categoria: "Proyectores",
    estado: "Disponible",
    cantidad: 2,
    numeroSerie: null,
    fechaIngreso: "2023-09-10",
    descripcion: "Proyector portátil para presentaciones.",
  },
  {
    id: 11,
    nombre: "Laptop Dell XPS 15",
    marca: "Dell",
    modelo: "XPS 15",
    categoria: "Laptops",
    estado: "Asignado",
    cantidad: 1,
    numeroSerie: "SN-XPS15-002",
    fechaIngreso: "2023-01-15",
    descripcion: "Laptop de alto rendimiento para uso profesional.",
  },
  {
    id: 12,
    nombre: "Laptop Dell XPS 15",
    marca: "Dell",
    modelo: "XPS 15",
    categoria: "Laptops",
    estado: "Prestado",
    cantidad: 1,
    numeroSerie: "SN-XPS15-003",
    fechaIngreso: "2023-01-15",
    descripcion: "Laptop de alto rendimiento para uso profesional.",
  },
  {
    id: 13,
    nombre: "Laptop Dell XPS 15",
    marca: "Dell",
    modelo: "XPS 15",
    categoria: "Laptops",
    estado: "PENDIENTE_DE_RETIRO",
    cantidad: 1,
    numeroSerie: "SN-XPS15-004",
    fechaIngreso: "2023-01-15",
    descripcion: "Laptop de alto rendimiento para uso profesional.",
  },
]

const defaultAsignadosData: AsignadoItem[] = [
  {
    id: 1,
    articuloId: 3,
    articuloNombre: "Teclado Mecánico HyperX",
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
    articuloNombre: "Laptop Dell XPS 15",
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
    articulo: "Mouse Logitech MX Master 3",
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
    articulo: "Laptop Dell XPS 15",
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
  pendingTasksData: defaultPendingTasksData,
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
  marcas: ["Dell", "LG", "HyperX", "Logitech", "TP-Link", "HP", "Seagate", "Epson"],
  retirementReasons: ["Fin de vida útil", "Obsoleto", "Dañado", "Perdido", "Robado", "Donación"],
  userColumnPreferences: [],
}

// Definición de tipos para las acciones
type AppAction =
  | { type: 'UPDATE_INVENTORY'; payload: InventoryItem[] }
  | { type: 'UPDATE_INVENTORY_ITEM_STATUS'; payload: { id: number; status: string } }
  | { type: 'ADD_RECENT_ACTIVITY'; payload: RecentActivity }
  | { type: 'UPDATE_PENDING_TASK'; payload: { id: number; updates: Partial<PendingTask> } }
  | { type: 'UPDATE_USER_COLUMN_PREFERENCES'; payload: { userId: number; pageId: string; columns: string[]; itemsPerPage?: number } }
  | { type: 'UPDATE_USER_THEME'; payload: string }
  | { type: 'UPDATE_MARCAS'; payload: string[] }
  | { type: 'ADD_PENDING_REQUEST'; payload: PendingActionRequest };

interface AppContextType {
  state: AppState
  dispatch: (action: AppAction) => void
  setUser: (user: User | null) => void
  updateInventory: (inventory: InventoryItem[]) => void
  addInventoryItem: (item: InventoryItem) => void
  updateInventoryItem: (id: number, updates: Partial<InventoryItem>) => void
  updateInventoryItemStatus: (id: number, status: string) => void
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
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("gati-c-app-state")
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState)
          // Merge saved state with default state to ensure all properties exist
          return { ...defaultInitialState, ...parsedState }
        } catch (e) {
          console.error("Error parsing saved state from localStorage", e)
          return defaultInitialState
        }
      }
    }
    return defaultInitialState
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gati-c-app-state", JSON.stringify(state))
    }
  }, [state])

  const setUser = useCallback((user: User | null) => {
    setState((prevState) => ({ ...prevState, user }))
  }, [])

  const updateInventory = useCallback((inventory: InventoryItem[]) => {
    setState((prevState) => ({ ...prevState, inventoryData: inventory }))
  }, [])

  const addInventoryItem = useCallback((item: InventoryItem) => {
    setState((prevState) => ({ ...prevState, inventoryData: [...prevState.inventoryData, item] }))
  }, [])

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
    setState((prevState) => ({ ...prevState, pendingTasksData: [...prevState.pendingTasksData, task] }))
  }, [])

  const updatePendingTask = useCallback((taskId: number, updates: Partial<PendingTask>) => {
    setState((prevState) => ({
      ...prevState,
      pendingTasksData: prevState.pendingTasksData.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
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
    setState((prevState) => ({
      ...prevState,
      marcas: marcas
    }));
  }, []);

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
      case 'ADD_RECENT_ACTIVITY':
        setState(prev => ({
          ...prev,
          recentActivities: [action.payload, ...prev.recentActivities].slice(0, 50),
        }));
        break;
      case 'UPDATE_PENDING_TASK':
        setState(prev => ({
          ...prev,
          pendingTasksData: prev.pendingTasksData.map(task =>
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
      case 'UPDATE_MARCAS':
        setState(prev => ({
          ...prev,
          marcas: action.payload
        }));
        break;
      case 'ADD_PENDING_REQUEST':
        setState(prev => ({
          ...prev,
          pendingActionRequests: [...prev.pendingActionRequests, action.payload]
        }));
        break;
      default:
        console.error('Unknown action type');
    }
  }, []);

  const value = React.useMemo(
    () => ({
      state,
      dispatch,
      setUser,
      updateInventory,
      addInventoryItem,
      updateInventoryItem,
      updateInventoryItemStatus: (id: number, status: string) => {
        updateInventoryItem(id, { estado: status as "Disponible" | "Asignado" | "Prestado" | "Retirado" | "En Mantenimiento" | "PENDIENTE_DE_RETIRO" })
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
    }),
    [
      state,
      dispatch,
      setUser,
      updateInventory,
      addInventoryItem,
      updateInventoryItem,
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
    ],
  )

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

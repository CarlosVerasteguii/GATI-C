"use client"

import React, { createContext, useState, useContext, useEffect, useCallback } from "react"
import type { InventoryItem, User, HistoryEvent } from "@/types/inventory"

// It's likely this type should live in `types/inventory.ts` alongside InventoryItem,
// but for now we can define it here to resolve type errors.
export type InventoryStatus = "AVAILABLE" | "ASSIGNED" | "LENT" | "RETIRED" | "PENDING_RETIREMENT";

// Application state type definitions
interface AssignmentItem {
  id: number
  inventoryItemId: number // ID of the original inventory item
  name: string
  serialNumber: string | null
  assignedTo: string
  assignmentDate: string // YYYY-MM-DD
  status: "ACTIVE" | "RETURNED"
  notes?: string
  registeredBy?: string
}

interface LoanItem {
  id: number
  inventoryItemId: number // ID of the original inventory item
  name: string
  serialNumber: string | null
  lentTo: string
  loanDate: string // YYYY-MM-DD
  returnDate: string // YYYY-MM-DD
  status: "ACTIVE" | "RETURNED" | "EXPIRED"
  remainingDays: number
  notes?: string
  registeredBy?: string
}

interface AccessRequest {
  id: number
  name: string
  email: string
  justification: string
  date: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  password?: string // Temporary password storage for approved access requests
}

interface PendingActionRequest {
  id: number
  type:
  | "PRODUCT_CREATION"
  | "PRODUCT_EDIT"
  | "PRODUCT_DUPLICATION"
  | "ASSIGNMENT"
  | "LOAN"
  | "PRODUCT_RETIREMENT"
  | "REACTIVATION"
  | "BULK_EDIT"
  | "BULK_ASSIGNMENT"
  | "BULK_LOAN"
  | "BULK_RETIREMENT"
  requestedBy: string
  date: string
  status: "PENDING" | "APPROVED" | "REJECTED"
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
  | "LOAD"
  | "RETIREMENT"
  | "ASSIGNMENT"
  | "LOAN"
  | "REACTIVATION"
  | "PRODUCT_CREATION"
  | "PRODUCT_EDIT"
  | "PRODUCT_DUPLICATION"
  creationDate: string
  createdBy: string
  status: "PENDING" | "COMPLETED" | "CANCELLED"
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
    1: 2, // Advanced Development Laptop
    3: 1, // UltraSharp Monitor
    // ...other products
  },
  categoryThresholds: {
    'Laptops': 3,
    'Monitors': 2,
    // ...other categories
  },
  globalThreshold: 3,
};

interface AppState {
  inventoryData: InventoryItem[]
  assignmentsData: AssignmentItem[]
  loansData: LoanItem[]
  accessRequests: AccessRequest[]
  pendingActionRequests: PendingActionRequest[]
  recentActivities: RecentActivity[]
  tasks: PendingTask[]
  categories: string[]
  brands: string[]
  providers: string[];
  locations: string[];
  retirementReasons: string[]
  userColumnPreferences: UserColumnPreference[]
  userTheme?: string // We add the user theme to the state
  error: string | null
  isDragOver: boolean
  isNavigating: boolean
  isUploading: boolean
  successMessage: string | null
  uploadProgress: number
  lowStockThresholds: InventoryLowStockThresholds;
}

// Datos de ejemplo (usuarios migrados a useAuthStore)

const defaultInventoryData: InventoryItem[] = [
  // Laptops
  {
    id: 1,
    name: "Advanced Development Laptop",
    brand: "Dell",
    model: "XPS 15",
    serialNumber: "DXPS15-001",
    category: "Laptops",
    status: "AVAILABLE", // Keep the literal value in English
    quantity: 1,
    entryDate: "2023-01-15",
    location: "Main Office - Floor 2",
    provider: "Compudel",
    cost: 2200,
    purchaseDate: "2023-01-10",
    isSerialized: true,
    warrantyExpirationDate: "2024-01-15",
    history: [
      {
        date: "2023-01-15",
        user: "Carlos Vera",
        action: "Product Entry",
        details: "New product added to inventory"
      },
      {
        date: "2023-03-20",
        user: "Ana López",
        action: "Assignment",
        details: "Assigned to Development department"
      }
    ]
  },
  {
    id: 2,
    name: "Management Laptop",
    brand: "Apple",
    model: "MacBook Pro 16",
    serialNumber: "AMBP16-002",
    category: "Laptops",
    status: "AVAILABLE",
    quantity: 1,
    entryDate: "2023-03-20",
    location: "Central Warehouse",
    provider: "iShop",
    cost: 2500,
    purchaseDate: "2023-03-15",
    isSerialized: true,
    warrantyExpirationDate: "2024-09-15",
    history: [
      {
        date: "2023-03-20",
        user: "Carlos Vera",
        action: "Product Entry",
        details: "New MacBook Pro added to inventory"
      },
      {
        date: "2023-05-10",
        user: "Ana López",
        action: "Status Update",
        details: "Moved to Available status after initial configuration"
      }
    ]
  },
  {
    id: 3,
    name: "Mobile Workstation",
    brand: "HP",
    model: "ZBook Fury G8",
    serialNumber: "HPZF-003",
    category: "Laptops",
    status: "AVAILABLE",
    quantity: 1,
    entryDate: "2022-11-05",
    location: "Technical Support",
    provider: "HP Directo",
    cost: 3100,
    purchaseDate: "2022-10-25",
    isSerialized: true,
    warrantyExpirationDate: "2026-12-31",
    history: [
      {
        date: "2022-11-05",
        user: "Carlos Vera",
        action: "Product Entry",
        details: "New ZBook Fury G8 added to inventory"
      }
    ]
  },
  {
    id: 4,
    name: "Travel Laptop",
    brand: "Lenovo",
    model: "ThinkPad X1 Carbon",
    serialNumber: "LTPX1-004",
    category: "Laptops",
    status: "LENT",
    lentTo: "Ana Gómez",
    loanDate: "2024-06-15",
    returnDate: "2024-06-30",
    quantity: 1,
    entryDate: "2023-05-10",
    location: "Main Office - Floor 2",
    provider: "Compudel",
    cost: 1800,
    purchaseDate: "2023-05-01",
    isSerialized: true,
    warrantyExpirationDate: null,
  },
  { id: 20, name: "Advanced Development Laptop", brand: "Dell", model: "XPS 15", serialNumber: "DXPS15-002", category: "Laptops", status: "AVAILABLE", quantity: 1, entryDate: "2023-01-15", location: "Central Warehouse", provider: "Compudel", cost: 2200, purchaseDate: "2023-01-10", isSerialized: true, warrantyExpirationDate: new Date().toISOString().split('T')[0] },

  // Monitors
  { id: 5, name: "Curved UltraWide Monitor", brand: "LG", model: "34WN780-B", serialNumber: "LG34-005", category: "Monitors", status: "AVAILABLE", quantity: 1, entryDate: "2023-02-01", location: "Main Office - Floor 1", provider: "TecnoMundo", cost: 750, purchaseDate: "2023-01-25", isSerialized: true },
  { id: 6, name: "4K Graphic Design Monitor", brand: "Dell", model: "UltraSharp U2721Q", serialNumber: "DU27-006", category: "Monitors", status: "ASSIGNED", quantity: 1, entryDate: "2022-09-15", location: "Design Area", provider: "Compudel", cost: 850, purchaseDate: "2022-09-10", isSerialized: true },
  { id: 7, name: "High Refresh Rate Monitor", brand: "ASUS", model: "ROG Swift PG279Q", serialNumber: "ASUSROG-007", category: "Monitors", status: "LENT", lentTo: "Sofía Castillo", loanDate: new Date().toISOString().split('T')[0], returnDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], quantity: 1, entryDate: "2023-06-01", location: "Central Warehouse", provider: "TecnoMundo", cost: 650, purchaseDate: "2023-05-28", isSerialized: true },

  // Peripherals
  { id: 8, name: "Wireless Mechanical Keyboard", brand: "Logitech", model: "MX Mechanical", serialNumber: null, category: "Peripherals", status: "AVAILABLE", quantity: 10, entryDate: "2023-04-10", location: "Central Warehouse", provider: "OfficeDepot", cost: 170, purchaseDate: "2023-04-05", isSerialized: false },
  { id: 9, name: "Vertical Ergonomic Mouse", brand: "Logitech", model: "MX Vertical", serialNumber: "LOGIMXV-009", category: "Peripherals", status: "ASSIGNED", quantity: 1, entryDate: "2023-02-20", location: "Main Office - Floor 2", provider: "OfficeDepot", cost: 100, purchaseDate: "2023-02-15", isSerialized: true },
  { id: 10, name: "4K Webcam", brand: "Logitech", model: "Brio 4K", serialNumber: null, category: "Peripherals", status: "AVAILABLE", quantity: 5, entryDate: "2023-05-30", location: "Central Warehouse", provider: "TecnoMundo", cost: 200, purchaseDate: "2023-05-25", isSerialized: false },

  // Servers and Networks
  { id: 11, name: "2U Rack Server", brand: "Dell", model: "PowerEdge R740", serialNumber: "DPER740-011", category: "Servers", status: "RETIRED", quantity: 1, entryDate: "2020-05-15", location: "Data Center A", provider: "HP Directo", cost: 5000, purchaseDate: "2020-05-01", isSerialized: true },
  { id: 12, name: "48-Port Managed Switch", brand: "Cisco", model: "Catalyst 2960", serialNumber: "CISCO2960-012", category: "Networks", status: "AVAILABLE", quantity: 1, entryDate: "2021-08-10", location: "Data Center A", provider: "TecnoMundo", cost: 1200, purchaseDate: "2021-08-01", isSerialized: true },
  { id: 13, name: "Next-Generation Firewall", brand: "Palo Alto", model: "PA-220", serialNumber: "PALO-220-013", category: "Security", status: "AVAILABLE", quantity: 1, entryDate: "2023-07-01", location: "Data Center B", provider: "HP Directo", cost: 900, purchaseDate: "2023-06-20", isSerialized: true },

  // Others
  { id: 14, name: "Full HD Meeting Room Projector", brand: "Epson", model: "PowerLite 1080", serialNumber: "EPSONPL-014", category: "Audio Visual", status: "AVAILABLE", quantity: 1, entryDate: "2022-06-10", location: "Meeting Room 1", provider: "OfficeDepot", cost: 800, purchaseDate: "2022-06-01", isSerialized: true },
  { id: 15, name: "Laser Multifunction Printer", brand: "HP", model: "LaserJet Pro M428fdw", serialNumber: "HPLJM-015", category: "Printers", status: "PENDING_RETIREMENT", quantity: 1, entryDate: "2021-01-20", location: "Copying Area", provider: "HP Directo", cost: 450, purchaseDate: "2021-01-15", isSerialized: true },
  { id: 16, name: "Professional Graphics Tablet", brand: "Wacom", model: "Intuos Pro M", serialNumber: "WIPM-016", category: "Peripherals", status: "LENT", lentTo: "Luis Fernández", loanDate: "2024-07-01", returnDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], quantity: 1, entryDate: "2023-08-01", location: "Design Area", provider: "TecnoMundo", cost: 380, purchaseDate: "2023-07-25", isSerialized: true },
  { id: 17, name: "USB-C Docking Station", brand: "Dell", model: "WD19S", serialNumber: null, category: "Accessories", status: "AVAILABLE", quantity: 20, entryDate: "2023-01-15", location: "Central Warehouse", provider: "Compudel", cost: 250, purchaseDate: "2023-01-10", isSerialized: false },
  { id: 18, name: "Wi-Fi Mesh Router (Pack of 3)", brand: "Google", model: "Nest Wifi", serialNumber: null, category: "Networks", status: "AVAILABLE", quantity: 2, entryDate: "2023-09-01", location: "Central Warehouse", provider: "iShop", cost: 300, purchaseDate: "2023-08-20", isSerialized: false },
  { id: 19, name: "Barcode Scanner", brand: "Zebra", model: "DS2208", serialNumber: null, category: "Accessories", status: "AVAILABLE", quantity: 8, entryDate: "2022-12-10", location: "Asset Inventory", provider: "Compudel", cost: 150, purchaseDate: "2022-12-01", isSerialized: false }
];

const defaultAssignmentsData: AssignmentItem[] = [
  {
    id: 1,
    inventoryItemId: 3,
    name: "HyperX Mechanical Keyboard",
    serialNumber: "HX-KB7RD2-US/RD",
    assignedTo: "Juan Pérez",
    assignmentDate: "2023-03-10",
    status: "ACTIVE",
    notes: "Assigned for development position.",
    registeredBy: "Carlos Vera",
  },
  {
    id: 2,
    inventoryItemId: 11,
    name: "Laptop Dell XPS 15",
    serialNumber: "SN-XPS15-002",
    assignedTo: "María García",
    assignmentDate: "2023-01-20",
    status: "ACTIVE",
    notes: "Main laptop for project manager.",
    registeredBy: "Carlos Vera",
  },
]

const defaultLoansData: LoanItem[] = [
  {
    id: 1,
    inventoryItemId: 4,
    name: "Mouse Logitech MX Master 3",
    serialNumber: "910-005647",
    lentTo: "Laura Torres",
    loanDate: "2023-04-05",
    returnDate: "2024-07-15",
    status: "ACTIVE",
    remainingDays: 20,
    notes: "Temporary loan for remote work.",
    registeredBy: "Ana López",
  },
  {
    id: 2,
    inventoryItemId: 12,
    name: "Laptop Dell XPS 15",
    serialNumber: "SN-XPS15-003",
    lentTo: "Roberto Fernández",
    loanDate: "2024-06-01",
    returnDate: "2024-06-30",
    status: "ACTIVE",
    remainingDays: 5,
    notes: "For external training.",
    registeredBy: "Ana López",
  },
]

const defaultPendingTasksData: PendingTask[] = [
  {
    id: 1,
    type: "LOAD",
    creationDate: "2024-06-15T10:00:00Z",
    createdBy: "Trusted IP User 1",
    status: "PENDING",
    details: {
      productName: "Wireless Mechanical Keyboard",
      brand: "Logitech",
      model: "MX Mechanical",
      category: "Peripherals",
      description: "Compact multi-device keyboard.",
      quantity: 5,
      serialNumbers: [],
    },
    auditLog: [
      {
        event: "CREATION",
        user: "Trusted IP User 1",
        dateTime: "2024-06-15T10:00:00Z",
        description: "Load task created from trusted IP.",
      },
    ],
  },
  {
    id: 2,
    type: "RETIREMENT",
    creationDate: "2024-06-16T14:30:00Z",
    createdBy: "Trusted IP User 2",
    status: "PENDING",
    details: {
      involvedItems: [
        {
          id: 13,
          name: "Laptop Dell XPS 15",
          serial: "SN-XPS15-004",
          model: "XPS 15",
          brand: "Dell",
          category: "Laptops",
          quantity: 1,
          originalId: 13,
          entryDate: "2023-01-15",
          description: "High-performance laptop for professional use.",
        },
      ],
      reason: "End of useful life",
    },
    auditLog: [
      {
        event: "CREATION",
        user: "Trusted IP User 2",
        dateTime: "2024-06-16T14:30:00Z",
        description: "Retirement task created from trusted IP.",
      },
    ],
  },
  {
    id: 3,
    type: "ASSIGNMENT",
    creationDate: "2024-06-17T09:15:00Z",
    createdBy: "Ana López",
    status: "PENDING",
    details: {
      productId: 8,
      productName: "Logitech C920 Webcam",
      productSerialNumber: null,
      assignedTo: "New Employee",
      notes: "For new employee workstation.",
    },
    auditLog: [
      {
        event: "CREATION",
        user: "Ana López",
        dateTime: "2024-06-17T09:15:00Z",
        description: "Assignment request created by Editor.",
      },
    ],
  },
  {
    id: 4,
    type: "LOAN",
    creationDate: "2024-06-18T11:00:00Z",
    createdBy: "Pedro García",
    status: "PENDING",
    details: {
      productId: 10,
      productName: "Epson PowerLite Projector",
      productSerialNumber: null,
      lentToName: "Meeting Room A",
      returnDate: "2024-06-25",
      notes: "For weekly presentation.",
    },
    auditLog: [
      {
        event: "CREATION",
        user: "Pedro García",
        dateTime: "2024-06-18T11:00:00Z",
        description: "Loan request created by Reader.",
      },
    ],
  },
]

const defaultInitialState: AppState = {
  inventoryData: defaultInventoryData,
  assignmentsData: defaultAssignmentsData,
  loansData: defaultLoansData,
  accessRequests: [],
  pendingActionRequests: [],
  recentActivities: [],
  tasks: defaultPendingTasksData,
  categories: [
    "Laptops",
    "Monitors",
    "Peripherals",
    "Servers",
    "Networks",
    "Printers",
    "Storage",
    "Projectors",
  ],
  brands: [],
  providers: [],
  locations: [],
  retirementReasons: ["End of useful life", "Damaged beyond repair"],
  userColumnPreferences: [],
  error: null,
  isDragOver: false,
  isNavigating: false,
  isUploading: false,
  successMessage: null,
  uploadProgress: 0,
  lowStockThresholds: defaultLowStockThresholds,
}

// Definition of types for actions
type AppAction =
  | { type: 'UPDATE_INVENTORY'; payload: InventoryItem[] }
  | { type: 'UPDATE_INVENTORY_ITEM_STATUS'; payload: { id: number; status: InventoryStatus } }
  | { type: 'ADD_RECENT_ACTIVITY'; payload: RecentActivity }
  | { type: 'UPDATE_PENDING_TASK'; payload: { id: number; updates: Partial<PendingTask> } }
  | { type: 'UPDATE_USER_COLUMN_PREFERENCES'; payload: { userId: number; pageId: string; columns: string[]; itemsPerPage?: number } }
  | { type: 'UPDATE_USER_THEME'; payload: string }
  | { type: 'SET_BRANDS'; payload: string[] }
  | { type: 'SET_PROVIDERS'; payload: string[] }
  | { type: 'SET_LOCATIONS'; payload: string[] }
  | { type: 'ADD_PENDING_REQUEST'; payload: PendingActionRequest }
  | { type: 'ADD_INVENTORY_ITEM'; payload: InventoryItem }
  | { type: 'ADD_HISTORY_EVENT'; payload: { itemId: number; event: HistoryEvent } };

// Definition of the interface for the context value
interface AppContextType {
  state: AppState
  dispatch: (action: AppAction) => void
  updateInventory: (inventory: InventoryItem[]) => void
  addInventoryItem: (item: InventoryItem) => void
  updateInventoryItem: (id: number, updates: Partial<InventoryItem>) => void
  releaseAssignment: (itemId: number, currentUser: User | null) => void
  updateInventoryItemStatus: (id: number, status: InventoryStatus) => void;
  removeInventoryItem: (id: number) => void
  updateAssignments: (assignments: AssignmentItem[]) => void
  addAssignment: (assignment: AssignmentItem) => void
  removeAssignment: (id: number) => void
  updateAssignmentStatus: (id: number, status: AssignmentItem["status"]) => void
  updateLoans: (loans: LoanItem[]) => void
  addLoan: (loan: LoanItem) => void
  removeLoan: (id: number) => void
  updateLoanStatus: (id: number, status: LoanItem["status"]) => void
  updateAccessRequests: (accessRequests: AccessRequest[]) => void
  addAccessRequest: (accessRequest: AccessRequest) => void
  updateAccessRequestStatus: (id: number, status: AccessRequest["status"]) => void
  updatePendingActionRequests: (requests: PendingActionRequest[]) => void
  addPendingRequest: (request: PendingActionRequest) => void
  addRecentActivity: (activity: RecentActivity) => void
  addPendingTask: (task: PendingTask) => void
  updatePendingTask: (taskId: number, updates: Partial<PendingTask>) => void
  updateUserColumnPreferences: (userId: number, pageId: string, columns: string[], itemsPerPage?: number) => void
  updateUserTheme: (theme: string) => void
  updateBrands: (brands: string[]) => void
  updateProviders: (providers: string[]) => void;
  updateLocations: (locations: string[]) => void;
  addHistoryEvent: (itemId: number, event: HistoryEvent) => void;
  returnLoan: (itemId: number, currentUser: User | null) => void;
  getEffectiveLowStockThreshold: (product: InventoryItem) => number;
  // --- Enterprise: Functions to edit low inventory thresholds ---
  /**
   * setProductLowStockThreshold: Define or update the low inventory threshold for a product.
   * If value is null, remove the product threshold.
   * Validates that the value is positive.
   */
  setProductLowStockThreshold: (productId: number, value: number | null) => void;
  /**
   * setCategoryLowStockThreshold: Define or update the low inventory threshold for a category.
   * If value is null, remove the category threshold.
   * Validates that the value is positive.
   */
  setCategoryLowStockThreshold: (category: string, value: number | null) => void;
  /**
   * setGlobalLowStockThreshold: Define the global low inventory threshold.
   * Validates that the value is positive.
   */
  setGlobalLowStockThreshold: (value: number) => void;
  /**
   * cleanOrphanThresholds: Remove thresholds for products/categories that no longer exist.
   * Recommended to call after deleting products/categories.
   */
  cleanOrphanThresholds: () => void;
}

// Context creation
const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("gati-c-app-state");
      // If a saved state exists, use it. Period.
      if (savedState) {
        try {
          return JSON.parse(savedState);
        } catch (e) {
          console.error("Error parsing saved state, falling back to default.", e);
          // If the saved state is corrupted, fall back to default.
          localStorage.removeItem("gati-c-app-state");
          return defaultInitialState;
        }
      }
    }
    // If no saved state, use the default state.
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
            item.id === action.payload.id ?
              { ...item, status: action.payload.status } :
              item
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
      case 'SET_BRANDS':
        setState(prev => ({
          ...prev,
          brands: action.payload
        }));
        break;
      case 'SET_PROVIDERS':
        setState(prev => ({
          ...prev,
          providers: action.payload
        }));
        break;
      case 'SET_LOCATIONS':
        setState(prev => ({
          ...prev,
          locations: action.payload
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
                history: [...(item.history || []), action.payload.event]
              }
              : item
          ),
        }));
        break;
      default:
        console.error('Unknown action type');
    }
  }, []);

  const updateInventory = useCallback((inventory: InventoryItem[]) => {
    setState((prevState) => ({ ...prevState, inventoryData: inventory }))
  }, [])

  const addInventoryItem = useCallback((item: InventoryItem) => {
    // Prepare the initial history event
    const creationEvent: HistoryEvent = {
      date: new Date().toISOString(),
      user: 'System',
      action: 'Creation',
      details: `The asset was created in the system.`
    };

    // Add the event to the new item's history
    const itemWithHistory = {
      ...item,
      history: [creationEvent]
    };

    dispatch({ type: 'ADD_INVENTORY_ITEM', payload: itemWithHistory });
  }, [dispatch]);

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

  const updateAssignments = useCallback((assignments: AssignmentItem[]) => {
    setState((prevState) => ({ ...prevState, assignmentsData: assignments }))
  }, [])

  const addAssignment = useCallback((assignment: AssignmentItem) => {
    setState((prevState) => ({ ...prevState, assignmentsData: [...prevState.assignmentsData, assignment] }))
  }, [])

  const removeAssignment = useCallback((id: number) => {
    setState((prevState) => ({
      ...prevState,
      assignmentsData: prevState.assignmentsData.filter((item) => item.id !== id),
    }))
  }, [])

  const updateAssignmentStatus = useCallback((id: number, status: AssignmentItem["status"]) => {
    setState((prevState) => ({
      ...prevState,
      assignmentsData: prevState.assignmentsData.map((item) => (item.id === id ? { ...item, status: status } : item)),
    }))
  }, [])

  const updateLoans = useCallback((loans: LoanItem[]) => {
    setState((prevState) => ({ ...prevState, loansData: loans }))
  }, [])

  const addLoan = useCallback((loan: LoanItem) => {
    setState((prevState) => ({ ...prevState, loansData: [...prevState.loansData, loan] }))
  }, [])

  const removeLoan = useCallback((id: number) => {
    setState((prevState) => ({
      ...prevState,
      loansData: prevState.loansData.filter((item) => item.id !== id),
    }))
  }, [])

  const updateLoanStatus = useCallback((id: number, status: LoanItem["status"]) => {
    setState((prevState) => ({
      ...prevState,
      loansData: prevState.loansData.map((item) => (item.id === id ? { ...item, status: status } : item)),
    }))
  }, [])

  const updateAccessRequests = useCallback((accessRequests: AccessRequest[]) => {
    setState((prevState) => ({ ...prevState, accessRequests: accessRequests }))
  }, [])

  const addAccessRequest = useCallback((accessRequest: AccessRequest) => {
    setState((prevState) => ({ ...prevState, accessRequests: [...prevState.accessRequests, accessRequest] }))
  }, [])

  const updateAccessRequestStatus = useCallback((id: number, status: AccessRequest["status"]) => {
    setState((prevState) => ({
      ...prevState,
      accessRequests: prevState.accessRequests.map(request =>
        request.id === id ? { ...request, status: status } : request
      )
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
        // Check if a preference already exists for this page
        const existingPrefIndex = prevState.userColumnPreferences.findIndex(pref => pref.page === pageId);

        if (existingPrefIndex !== -1) {
          // Update existing preference
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
          // Create new preference
          const allColumnsForPage = pageId === "inventory"
            ? [
              { id: "name", label: "Name", visible: true },
              { id: "brand", label: "Brand", visible: true },
              { id: "model", label: "Model", visible: true },
              { id: "serialNumber", label: "Serial Number", visible: true },
              { id: "category", label: "Category", visible: true },
              { id: "status", label: "Status", visible: true },
              { id: "provider", label: "Provider", visible: false },
              { id: "purchaseDate", label: "Purchase Date", visible: false },
              { id: "contractId", label: "Contract ID", visible: false },
              { id: "assignedTo", label: "Assigned To", visible: false },
              { id: "assignmentDate", label: "Assignment Date", visible: false }
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

  const updateBrands = useCallback((brands: string[]) => {
    dispatch({ type: 'SET_BRANDS', payload: brands });
  }, [dispatch]);

  const updateProviders = useCallback((providers: string[]) => {
    dispatch({ type: 'SET_PROVIDERS', payload: providers });
  }, [dispatch]);

  const updateLocations = useCallback((locations: string[]) => {
    dispatch({ type: 'SET_LOCATIONS', payload: locations });
  }, [dispatch]);

  const addHistoryEvent = useCallback((itemId: number, event: HistoryEvent) => {
    dispatch({ type: 'ADD_HISTORY_EVENT', payload: { itemId, event } });
  }, [dispatch]);

  const releaseAssignment = useCallback((itemId: number, currentUser: User | null) => {
    dispatch({
      type: 'UPDATE_INVENTORY_ITEM_STATUS',
      payload: { id: itemId, status: 'AVAILABLE' as InventoryStatus }
    });

    addHistoryEvent(itemId, {
      date: new Date().toISOString(),
      user: currentUser?.name || 'System',
      action: 'Release',
      details: 'The asset has been returned to stock.'
    });
  }, [dispatch, addHistoryEvent])

  const returnLoan = useCallback((itemId: number, currentUser: User | null) => {
    // 1. Update the status in the main inventory list
    updateInventoryItem(itemId, {
      status: "AVAILABLE" as InventoryStatus,
      lentTo: null,
      loanDate: null,
      returnDate: null
    });

    // 2. Update the status in the separate loans list
    const activeLoan = state.loansData.find(loan => loan.inventoryItemId === itemId && loan.status === "ACTIVE");
    if (activeLoan) {
      updateLoanStatus(activeLoan.id, "RETURNED");
    }

    // 3. Register the event in the history
    addHistoryEvent(itemId, {
      date: new Date().toISOString(),
      user: currentUser?.name || 'System',
      action: 'Loan Return',
      details: 'The asset has been returned to stock.'
    });
  }, [state.loansData, updateInventoryItem, updateLoanStatus, addHistoryEvent]);

  /**
   * getEffectiveLowStockThreshold: Returns the low stock threshold for a product.
   * Priority: productThresholds > categoryThresholds > globalThreshold
   * @param product InventoryItem
   */
  const getEffectiveLowStockThreshold = useCallback((product: InventoryItem): number => {
    if (state.lowStockThresholds.productThresholds[product.id] !== undefined) {
      return state.lowStockThresholds.productThresholds[product.id];
    }
    if (product.category && state.lowStockThresholds.categoryThresholds[product.category] !== undefined) {
      return state.lowStockThresholds.categoryThresholds[product.category];
    }
    return state.lowStockThresholds.globalThreshold;
  }, [state.lowStockThresholds]);

  // --- Enterprise: Functions to edit low inventory thresholds ---
  /**
   * setProductLowStockThreshold: Define or update the low inventory threshold for a product.
   * If value is null, remove the product threshold.
   * Validates that the value is positive.
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
   * setCategoryLowStockThreshold: Define or update the low inventory threshold for a category.
   * If value is null, remove the category threshold.
   * Validates that the value is positive.
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
   * setGlobalLowStockThreshold: Define the global low inventory threshold.
   * Validates that the value is positive.
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
   * cleanOrphanThresholds: Remove thresholds for products/categories that no longer exist.
   * Recommended to call after deleting products/categories.
   */
  const cleanOrphanThresholds = useCallback(() => {
    setState(prev => {
      const validProductIds = new Set(prev.inventoryData.map(item => item.id));
      const validCategories = new Set(prev.categories);
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
  // TODO: Add persistence, change history and role validation in the future.

  // Effect to initialize brands and providers from inventory data
  useEffect(() => {
    const allBrands = [...new Set(state.inventoryData.map(item => item.brand))];
    updateBrands(allBrands);

    const allProviders = [...new Set(state.inventoryData.map(item => item.provider).filter(Boolean) as string[])];
    updateProviders(allProviders);

    const allLocations = [...new Set(state.inventoryData.map(item => item.location).filter(Boolean) as string[])];
    updateLocations(allLocations);

  }, [state.inventoryData, updateBrands, updateProviders, updateLocations]);

  const value = {
    state,
    dispatch,
    updateInventory,
    addInventoryItem,
    updateInventoryItem,
    releaseAssignment,
    updateInventoryItemStatus: (id: number, status: InventoryStatus) => {
      const item = state.inventoryData.find(i => i.id === id)
      if (item) {
        updateInventoryItem(id, { status: status })
      }
    },
    removeInventoryItem,
    updateAssignments,
    addAssignment,
    removeAssignment,
    updateAssignmentStatus,
    updateLoans,
    addLoan,
    removeLoan,
    updateLoanStatus,
    updateAccessRequests,
    addAccessRequest,
    updateAccessRequestStatus,
    updatePendingActionRequests,
    addPendingRequest,
    addRecentActivity,
    addPendingTask,
    updatePendingTask,
    updateUserColumnPreferences,
    updateUserTheme,
    updateBrands,
    updateProviders,
    updateLocations,
    addHistoryEvent,
    returnLoan,
    getEffectiveLowStockThreshold,
    // --- Enterprise: Functions to edit low inventory thresholds ---
    /**
     * setProductLowStockThreshold: Define or update the low inventory threshold for a product.
     * If value is null, remove the product threshold.
     * Validates that the value is positive.
     */
    setProductLowStockThreshold,
    /**
     * setCategoryLowStockThreshold: Define or update the low inventory threshold for a category.
     * If value is null, remove the category threshold.
     * Validates that the value is positive.
     */
    setCategoryLowStockThreshold,
    /**
     * setGlobalLowStockThreshold: Define the global low inventory threshold.
     * Validates that the value is positive.
     */
    setGlobalLowStockThreshold,
    /**
     * cleanOrphanThresholds: Remove thresholds for products/categories that no longer exist.
     * Recommended to call after deleting products/categories.
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
